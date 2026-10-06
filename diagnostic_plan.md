# Sakhi Women's Safety App — Full Diagnostic Report & Implementation Plan

---

## A. Project Understanding

### Architecture
**"Sakhi"** is a full-stack women's safety web application with the following stack:

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Animation | `motion` (Framer Motion successor) |
| Backend | Express.js 4 (embedded in Vite dev via plugin) |
| Database | In-memory `ResilientDB` (Map-based, no persistence) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| AI Service | Google Gemini 2.5 Flash (`@google/genai`) |
| SMS Service | Twilio (optional) with mock fallback |
| Runtime | Node.js via `tsx` / bun |
| Package Manager | Bun (bun.lock) |

### Main Features
1. **Landing Page** — Marketing page with multiple animated stages
2. **Authentication** — Login / Signup / 1-Click Demo Login
3. **Dashboard** — SOS button, contacts warning, nearest safe place, helplines, SOS history
4. **SOS Alert System** — 3-second countdown, auto-dial 112, GPS SMS dispatch
5. **Emergency Contacts** — CRUD for up to 5 trusted contacts
6. **Safe Amenities** — Nearby police, hospital, pharmacy, hostel, transport (simulated/offset from GPS)
7. **Transport Page** — Safe transit hubs, journey share, safety checklist
8. **AI Companion** — Chat interface backed by Gemini (with local fallback)
9. **Incident Registry** — Community safety incident reporting & feed
10. **Emergency Helplines Grid** — Static list of Indian emergency numbers

### Data Flow
```
Browser (React)  →  /api/*  →  Express routes  →  In-memory DB / external services
         ↑                              |
         └──────── JSON response ───────┘
```

### Key Architecture Decisions
- The backend is served **embedded in Vite's dev server** (via `expressApiPlugin` in `vite.config.ts`). In production mode (`npm start`), `server/index.ts` directly serves both the API and the built static `dist/` folder from a **single Express process on port 3000**.
- The database is purely **in-memory** — data is lost on server restart. This is intentional by design (noted in code as "Resilient DB").
- All amenity data is **simulated** — the `placesService` generates places by applying coordinate offsets to the user's GPS position. No real Google/OSM Places API is called.

---

## B. Overall Status

**Overall Status: ⚠️ Partially Working**

The application has a well-structured codebase. Core features (auth, SOS dispatch, contacts CRUD, amenities, AI companion, incidents) are wired up end-to-end. However, there are **several real bugs and UX/integration problems** that would cause visible failures in production:

1. A **critical race condition in the SOS modal** makes it possible to dispatch multiple SOS alerts simultaneously
2. The SOS modal's `triggerSosAlert` is called inside a `setCountdown` state callback — making it impossible to access updated React state (e.g., `customNote`) correctly
3. The **CORS configuration** will block all production/cross-origin requests from working if `APP_URL` is misconfigured
4. **Login does not redirect authenticated users** away from the login page — authenticated users can always re-visit `/login`
5. The **ContactsPage** does not check authentication before loading — it calls `contactService.getContacts()` even for unauthenticated users, which will return a 401 error that is silently swallowed
6. A **`vite` dependency duplication** in `package.json` (both in `dependencies` and `devDependencies`)
7. **`motion/react`** is imported in `LandingPage.tsx` but the package installed is named `motion` — this works in newer versions but is version-specific
8. **No route protection** — all protected pages (`/dashboard`, `/contacts`, `/companion`, `/incidents`) are accessible without authentication and will fail with 401 when making API calls
9. The LandingPage creates its **own `useGeolocation()` hook instance** in addition to the one in `AppContent`, meaning geolocation is requested twice on the landing page
10. Minor: `@types/bcryptjs` v3 is a devDependency but bcryptjs v3 is a production dependency — types should match

---

## C. Feature Status

| Feature | Status | Problem Summary |
|---|---|---|
| Landing Page | ✅ Working | Renders correctly, scroll progress, SOS modal |
| User Registration (Signup) | ✅ Working | Full validation, bcrypt hash, JWT returned |
| User Login | ✅ Working | Password compare, JWT issued |
| Demo Login | ✅ Working | Seeded demo user always available |
| Session Persistence | ✅ Working | localStorage token, `/api/auth/me` on mount |
| Logout | ✅ Working | Clears localStorage, redirects |
| Route Protection | ❌ Broken | No protected routes — unauthenticated users see blank/error states |
| Dashboard Stats Load | ⚠️ Partial | Works when authenticated; silently fails without auth |
| SOS Trigger (UI flow) | ⚠️ Partial | Core flow works but race condition bug, `customNote` state capture bug |
| SOS History View | ✅ Working | Fetches from API, displayed on Dashboard |
| SOS Status Update (Resolve/False Alarm) | ✅ Working | PATCH endpoint works |
| Emergency Contacts CRUD | ⚠️ Partial | Works when authenticated; no auth redirect on page load |
| Nearby Amenities | ✅ Working | Simulated data, correctly offset from GPS coordinates |
| Amenity Search/Filter | ✅ Working | Category tabs + text search work client-side |
| Interactive Map Modal | ✅ Working | OpenStreetMap iframe embed |
| Transport Page | ✅ Working | Loads transport-type amenities, journey share works |
| AI Companion Chat | ⚠️ Partial | Works with Gemini API key set; fallback works but AI endpoint has no auth guard |
| Incident Reporting | ⚠️ Partial | Auth gate in UI, but fetching incidents works for everyone |
| Incident Feed | ✅ Working | Public API, correctly displayed |
| Emergency Helpline Grid | ✅ Working | Static data, dial links work |
| Permissions Update | ✅ Working | PATCH /api/auth/permissions |
| Mobile Bottom Nav SOS | ✅ Working | Triggers dial pad and modal |
| Navbar GPS Badge | ✅ Working | Reflects geolocation state |

---

## D. Critical Problems

### Problem #1 — Race Condition: Double SOS Dispatch

**Severity:** Critical

**Location:** `src/components/SOSButtonModal.tsx` (lines 71–88)

**Problem:**
The `setInterval` countdown timer calls `triggerSosAlert()` when it hits zero. Simultaneously, there's a manual "Send SMS Beacon Now" button (`btn-instant-sos`) that also directly calls `triggerSosAlert()`. If a user taps "Send Now" during the countdown (before the timer fires), **both will fire**:
1. `btn-instant-sos` immediately calls `triggerSosAlert()` and sets stage to `'dispatching'`
2. The `setInterval` callback still fires at `prev <= 1` because `clearInterval` is called inside `triggerSosAlert`, but by then the interval callback is already executing

This results in **two SOS API calls**, two server records, and possibly two sets of SMS alerts.

**Root Cause:** The interval fires from inside `setCountdown`'s callback, and the `clearInterval` within `triggerSosAlert` runs after the state update callback has already started. There is no guard preventing double execution.

**Impact:** Duplicate SOS records, potential duplicate SMS alerts to emergency contacts.

**Evidence:**
```typescript
// Line 72-79: interval fires triggerSosAlert at 0
timerRef.current = setInterval(() => {
  setCountdown((prev) => {
    if (prev <= 1) {
      clearInterval(timerRef.current!);
      triggerSosAlert();  // <-- fired from state setter
      return 0;
    }
    return prev - 1;
  });
}, 1000);

// Line 344: manual button also calls directly
onClick={triggerSosAlert}  // <-- can fire simultaneously
```

**Required Fix:** Add a `isDispatching` ref (not state) that is set to `true` atomically at the start of `triggerSosAlert()` and checked as a guard at the beginning of the function. Clear the interval first via the ref before any async work.

---

### Problem #2 — `customNote` Stale Closure in SOS Countdown Callback

**Severity:** High

**Location:** `src/components/SOSButtonModal.tsx` (lines 71–88, 107–124)

**Problem:**
The `triggerSosAlert` function is called from inside a `setCountdown` state updater callback (line 75). State updater callbacks in React capture the *old closure* of the function. However, `triggerSosAlert` references `customNote` (state variable) and `geoState` (prop). Since `triggerSosAlert` is defined in the component body but *called from inside a state setter*, it will capture the initial value of `customNote` (empty string `''`) from the closure at the time the interval was set up, **not** the latest value the user typed.

**Root Cause:** The function `triggerSosAlert` is defined at component scope but called indirectly via `setCountdown`'s updater. `customNote` is not a ref, so its value inside the closure is stale.

**Impact:** When the 3-second countdown fires automatically (not manually), the `customMessage` sent to the server will always be `undefined` even if the user typed a note.

**Required Fix:** Store `customNote` in a `useRef` alongside the state, or move the auto-trigger logic out of the state setter callback and into a separate `useEffect` that watches the countdown value.

---

### Problem #3 — No Route-Level Authentication Guards (Protected Routes)

**Severity:** High

**Location:** `src/App.tsx` (lines 35–43)

**Problem:**
All authenticated pages (`/dashboard`, `/contacts`, `/companion`, `/incidents`) are rendered without any auth check. An unauthenticated user visiting these URLs:
1. Sees the full page UI instantly
2. The page components make API calls that return 401
3. Errors are silently caught (`.catch(() => {})` / `console.warn`) and the page renders empty data or loading states forever

There is no redirect to `/login` for protected pages.

**Root Cause:** `App.tsx` uses plain `<Route>` with no `PrivateRoute` wrapper or auth check in the route definition.

**Impact:** Unauthenticated users see broken/empty authenticated pages. Security: unauthenticated users can see the structural layout of all protected features.

**Required Fix:** Create a `<PrivateRoute>` component that checks `isAuthenticated && !isLoading` from `AuthContext` and redirects to `/login` if not authenticated.

---

### Problem #4 — `ContactsPage` Fetches Contacts Without Auth Check

**Severity:** High

**Location:** `src/pages/ContactsPage.tsx` (lines 41–51, 53–55)

**Problem:**
`ContactsPage` calls `contactService.getContacts()` unconditionally in its `useEffect` on mount. Without a token (unauthenticated users), this calls `GET /api/contacts` which requires `requireAuth`. The backend returns a 401, which is caught by the catch block and silently logged. The page shows an empty contacts list with an "Add Contact" button — clicking it would also fail with 401 and show the `formError` state.

**Root Cause:** No `isAuthenticated` check before calling the authenticated API.

**Impact:** Degraded experience for unauthenticated users; API errors silently swallowed.

**Required Fix:** Add `const { isAuthenticated } = useAuth()` and conditionally fetch only when authenticated, plus redirect to login when not.

---

### Problem #5 — `vite` Listed in Both `dependencies` and `devDependencies`

**Severity:** Medium

**Location:** `package.json` (lines 29, 42)

**Problem:**
`vite` is listed twice:
- `"dependencies": { "vite": "^6.2.3" }` (line 29)
- `"devDependencies": { "vite": "^6.2.3" }` (line 42)

This is a `package.json` misconfiguration. `vite` is a build tool and should only be in `devDependencies`. Having it in `dependencies` inflates production bundle size and can cause version resolution issues.

**Root Cause:** Likely a copy-paste error when adding the dependency.

**Impact:** Production builds include Vite unnecessarily. Potential version conflicts.

**Required Fix:** Remove `vite` from `dependencies`.

---

### Problem #6 — CORS Policy: Restrictive and Potentially Breaking in Development

**Severity:** Medium

**Location:** `server/app.ts` (lines 14–22)

**Problem:**
```typescript
const allowedOrigin = process.env.APP_URL || 'http://localhost:3000';
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin === allowedOrigin) return cb(null, true);
    cb(new Error(`CORS: Origin '${origin}' not allowed`));
  },
  credentials: true,
}));
```

In the Vite dev server, the Express plugin intercepts `/api` requests server-side (same Node.js process), so CORS is bypassed. However:
1. If `APP_URL` is not set in `.env`, only `http://localhost:3000` is allowed
2. The comparison is **exact string match** — `http://localhost:3000/` (with trailing slash) or `https://localhost:3000` (HTTPS) would be rejected
3. In cloud/production environments, if `APP_URL` doesn't exactly match the browser's origin, all API calls fail

**Root Cause:** The CORS check uses exact string equality rather than `allowedOrigins.includes(origin)` or a regex.

**Impact:** API calls fail silently in mismatched environments. Production deployments require `APP_URL` to be set exactly.

**Required Fix:** Support an array of allowed origins, or use a regex match. Also add the wildcard localhost catch.

---

### Problem #7 — `LandingPage` Creates a Redundant `useGeolocation()` Instance

**Severity:** Medium

**Location:** `src/pages/LandingPage.tsx` (line 26), `src/App.tsx` (line 18)

**Problem:**
`AppContent` in `App.tsx` calls `useGeolocation()` and passes the result as props to pages. However, `LandingPage` **also** calls `useGeolocation()` independently on line 26 of `LandingPage.tsx`. This means:
1. The browser's `navigator.geolocation` is called **twice** simultaneously
2. Two `watchPosition` observers are registered on the landing page
3. Only one `clearWatch` is called on unmount (from `useGeolocation` in `AppContent`); the one from `LandingPage` is cleaned up when `LandingPage` unmounts

Additionally, the `geoState` used by the SOS modal on the landing page is from the **local `LandingPage` instance**, not the one from `AppContent`. These are separate state objects and may diverge.

**Root Cause:** `LandingPage` needs geolocation for the SOS modal, but instead of using the passed-down `geoState` (which isn't currently passed), it creates a new hook instance.

**Impact:** Double permission requests, double GPS calls, unnecessary battery drain, potential state divergence.

**Required Fix:** Pass `geoState` as a prop to `LandingPage` from `App.tsx` instead of creating a second hook instance.

---

### Problem #8 — SOS Modal Auto-Dial Fires on Every Modal Open, Even on Re-Opens

**Severity:** Medium

**Location:** `src/components/SOSButtonModal.tsx` (lines 57–88)

**Problem:**
Every time `isOpen` changes to `true`, the `useEffect` immediately calls `triggerEmergencyDialPad(initialDialNumber)`. This means:
- If the user closes the modal (via "I'm Safe / Dismiss") and accidentally opens it again, the phone dialer is triggered again
- There's no way to open the modal without triggering an automatic phone dial

Additionally, the `countdown` is reset to 3 every time the modal opens, which also means the SMS countdown restarts, but the stage is already set to `'countdown'` even if `dispatchResult` from a previous run still exists briefly (it's cleared, but there's a visual flash risk).

**Root Cause:** The `useEffect` on `[isOpen, initialDialNumber]` fires unconditionally when `isOpen = true`.

**Impact:** Unintended emergency dials when modal is re-opened or accidentally triggered.

**Required Fix:** Add a check inside the `useEffect` to only auto-dial on the first open after a fresh mount, or debounce/confirm the dial action.

---

### Problem #9 — Login Page Accessible to Already-Authenticated Users

**Severity:** Low–Medium

**Location:** `src/pages/LoginPage.tsx` (line 37 — redirect target)

**Problem:**
After a successful login, the user is redirected to `'/'` (landing page) rather than `'/dashboard'`. More importantly, if an already-authenticated user visits `/login`, there is no redirect away from the login page. They see the login form and can log in again (with a new token).

**Root Cause:** No `useEffect` check for `isAuthenticated` in `LoginPage`, and the post-login redirect goes to `'/'` instead of `'/dashboard'`.

**Impact:** Confusing UX; authenticated users see the login form.

**Required Fix:**
1. Add `useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated])` in `LoginPage`
2. Change post-login redirect from `navigate('/')` to `navigate('/dashboard')`

---

### Problem #10 — AI Route Has No Authentication Guard

**Severity:** Low–Medium

**Location:** `server/routes/aiRoutes.ts` (no `requireAuth` middleware)

**Problem:**
`POST /api/ai/query` is completely public — no authentication required. Any client can call this endpoint unlimited times, incurring Gemini API costs and potentially abuse. Compare to `/api/incidents` which is also partially public (GET is public, POST requires auth).

**Root Cause:** `requireAuth` was not added to `aiRouter`.

**Impact:** Potential API cost abuse; Gemini API usage without auth.

**Required Fix:** Add `aiRouter.use(requireAuth)` at the top of `aiRoutes.ts`, or at minimum add rate limiting.

---

## E. Cross-Module / API Integration Issues

### Issue 1: Frontend Auth Context — Missing Error Propagation on Login

**Frontend (`AuthContext.tsx` lines 49–58):**
```typescript
const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const data = await authService.login({ email, password });
    ...
  } finally {
    setIsLoading(false);
  }
};
```

The `login()` function does not re-throw errors. If `authService.login()` throws (e.g., 401 Invalid credentials), the error is swallowed by the `finally` block and the promise resolves `undefined`.

**LoginPage.tsx (lines 31–40)** calls `await login(...)` and catches the error in its own try/catch — but since `login()` doesn't re-throw, the catch block in `LoginPage` never fires. `setError(...)` is never called, so the user sees no error message.

**Fix Required:** Add `throw err` inside `AuthContext.login()`, `signup()`, and `demoLogin()` catch blocks (or remove try/finally and let errors propagate).

---

### Issue 2: SOS `triggerSosAlert` — Auth Not Guaranteed

**Frontend:** `SOSButtonModal.tsx` calls `sosService.triggerSOS(...)` which calls `POST /api/sos/trigger`.

**Backend:** The SOS router uses `sosRouter.use(requireAuth)` — this is correct. If the user is not logged in and the SOS modal fires, the API returns 401. The error is caught on line 117–122 of `SOSButtonModal.tsx` and displayed as `errorMessage`, which is good — but the user then has to manually dial.

**Assessment:** Acceptable design for the safety use case. The fallback call buttons in the modal remain functional.

---

### Issue 3: `amenityService` Called Without Auth (Correct by Design)

`GET /api/amenities/nearby` has **no auth requirement** in `amenityRoutes.ts`. This is intentional — amenities should be viewable by everyone, including unauthenticated users. This is correct behavior.

---

### Issue 4: `incidentService.getIncidents()` Called Without Auth (Correct by Design)

`GET /api/incidents` is public — correct by design for community awareness. `POST /api/incidents` requires auth — also correct.

---

## F. Runtime / Build Problems

### F1 — No `.env` File Present (⚠️ Cannot Verify Without Runtime)

The project requires `.env` with at minimum `JWT_SECRET`. Without it:
- JWT will use the insecure dev fallback `'sakhi_dev_only_secret_do_not_use_in_prod'`
- Gemini AI will not work (no `GEMINI_API_KEY`)
- Twilio SMS will run in mock mode (acceptable)

The `server/middleware/auth.ts` logs a warning if `JWT_SECRET` is missing.

**Status:** Cannot confirm whether `.env` exists — only `.env.example` is present.

### F2 — `vite` Duplicated in `package.json` (Confirmed)

As noted in Problem #5.

### F3 — `motion/react` Import Path

`LandingPage.tsx` (line 2): `import { motion, useScroll, useSpring } from 'motion/react';`

The installed package is `motion` (v12.x). In Motion v12+, `motion/react` is the correct subpath export for React. This **should** work fine with the current version. ✅

### F4 — Node/Bun Runtime Not Verified

Neither `node`, `npm`, `npx`, nor `bun` responded in the terminal. The project has a `bun.lock` file indicating **bun** is the intended package manager. The `package.json` `start` script uses `tsx`, which is also installed. Cannot run type-check or lint without runtime tools available.

### F5 — TypeScript `strict` Mode Disabled

`tsconfig.json` has no `"strict": true`. This means many type errors are silently ignored. The app may have type mismatches that would surface in a strict build.

---

## G. Security Problems

| # | Severity | Location | Issue |
|---|---|---|---|
| G1 | High | `server/middleware/auth.ts:9` | **Insecure JWT fallback** — if `JWT_SECRET` env var is not set, uses hardcoded string `'sakhi_dev_only_secret_do_not_use_in_prod'`. Any token signed with this known key is fully valid. |
| G2 | Medium | `server/routes/aiRoutes.ts` | **No authentication** on AI endpoint — allows unauthenticated API cost abuse. |
| G3 | Low | `server/routes/incidentRoutes.ts:9` | **Public GET on incidents** — appropriate for community safety but user GPS coordinates are stored and returned publicly with `userId` attached |
| G4 | Low | `server/db.ts:16` | **Hardcoded demo credentials** — demo user `ananya@sakhi.org` / `sakhi123` is always available in the in-memory store. Acceptable for demo, but document clearly. |
| G5 | Low | `server/app.ts:57` | **Error message leakage** — global error handler exposes `err.message` in production responses. Should sanitize in production. |
| G6 | Info | `src/services/api.ts:34` | **Incorrect auth redirect bypass** — the response interceptor checks `window.location.pathname.includes('/landing')` to suppress 401 warnings, which means any 401 on the landing page is silently ignored rather than being surfaced to the user. |

---

## H. Missing / Incomplete Features

| # | Feature | Status |
|---|---|---|
| H1 | **Protected Routes** | Completely absent — all pages accessible without auth |
| H2 | **Post-login redirect to Dashboard** | Redirects to `/` (Landing) instead of `/dashboard` |
| H3 | **Login page redirect for authenticated users** | No auto-redirect away from `/login` |
| H4 | **Password visibility toggle** | Login/signup forms have no show/hide password button |
| H5 | **Phone number validation** | Contacts form accepts any string as phone |
| H6 | **Email validation beyond `type="email"`** | No backend email format validation |
| H7 | **SOS alert status polling** | Dashboard shows latest SOS but does not auto-refresh after status change |
| H8 | **Rate limiting** | No rate limiting on any API endpoint |
| H9 | **AI endpoint auth guard** | AI queries usable without login |
| H10 | **Error display for failed `getContacts` on auth failure** | Error silently swallowed |

---

## I. Recommended Fix Order

1. **[CRITICAL]** Fix SOS double-dispatch race condition (Problem #1)
2. **[CRITICAL]** Fix `customNote` stale closure in countdown (Problem #2)
3. **[HIGH]** Fix auth error propagation in `AuthContext` (Issue E1)
4. **[HIGH]** Implement Protected Routes in `App.tsx` (Problem #3)
5. **[HIGH]** Add auth check + redirect in `ContactsPage` (Problem #4)
6. **[MEDIUM]** Fix post-login redirect: `'/'` → `'/dashboard'` (Problem #9a)
7. **[MEDIUM]** Add already-authenticated redirect in `LoginPage` (Problem #9b)
8. **[MEDIUM]** Fix `vite` dependency duplication in `package.json` (Problem #5)
9. **[MEDIUM]** Fix `LandingPage` dual `useGeolocation()` instance (Problem #7)
10. **[MEDIUM]** Add `requireAuth` to AI route (Problem #10)
11. **[LOW]** Fix CORS configuration (Problem #6)
12. **[LOW]** Add phone number validation (H5)
13. **[LOW]** Sanitize error messages in production (G5)

---

# Implementation Plan

---

## Phase 1 — Critical Fixes (SOS Race Condition & Stale Closure)

### Fix 1.1 — SOS Double-Dispatch Race Condition

**File:** `src/components/SOSButtonModal.tsx`

**What to change:**
Add a `isDispatchingRef = useRef(false)` guard at the top of the component. At the very beginning of `triggerSosAlert()`, check and set this ref atomically. Also clear the interval using the ref before proceeding.

```diff
+ const isDispatchingRef = useRef<boolean>(false);

  const triggerSosAlert = async () => {
+   if (isDispatchingRef.current) return;  // Guard against double-fire
+   isDispatchingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('dispatching');
    ...
    // At the end (success or failure), reset the ref
+   isDispatchingRef.current = false;
  };
```

Reset `isDispatchingRef.current = false` when modal closes in the `useEffect` cleanup:
```diff
  } else {
    if (timerRef.current) clearInterval(timerRef.current);
+   isDispatchingRef.current = false;
  }
```

**Expected Result:** SOS can only dispatch once per modal open session, regardless of countdown or button clicks.

---

### Fix 1.2 — `customNote` Stale Closure via Ref

**File:** `src/components/SOSButtonModal.tsx`

**What to change:**
Add a `customNoteRef = useRef(customNote)` and keep it in sync via a dedicated `useEffect`. Use `customNoteRef.current` inside `triggerSosAlert` instead of `customNote` directly.

Move the auto-dispatch out of the `setCountdown` state setter and into a `useEffect` watching the countdown value:

```diff
+ const customNoteRef = useRef(customNote);
+ useEffect(() => { customNoteRef.current = customNote; }, [customNote]);

  // Replace the setInterval countdown with a useEffect-based approach
  useEffect(() => {
    if (!isOpen || stage !== 'countdown') return;
    if (countdown <= 0) {
      triggerSosAlert();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, countdown, stage]);

  // Inside triggerSosAlert, use ref:
  const res = await sosService.triggerSOS({
    ...
-   customMessage: customNote.trim() || undefined,
+   customMessage: customNoteRef.current.trim() || undefined,
  });
```

**Expected Result:** Custom note always reflects the latest user input when SOS is dispatched.

---

## Phase 2 — Core Functionality Fixes

### Fix 2.1 — Auth Error Propagation in `AuthContext`

**File:** `src/context/AuthContext.tsx`

**What to change:**
Add `throw err` in the catch blocks of `login`, `signup`, and `demoLogin`:

```diff
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('sakhi_token', data.token);
      setToken(data.token);
      setUser(data.user);
+   } catch (err) {
+     throw err;  // Re-throw so LoginPage can display the error
    } finally {
      setIsLoading(false);
    }
  };
```

Apply the same pattern to `signup` and `demoLogin`.

**Expected Result:** `LoginPage` catch blocks will execute correctly, `setError(...)` will be called, and the user sees the validation/auth error message.

---

### Fix 2.2 — Protected Routes in `App.tsx`

**File:** `src/App.tsx`

**What to change:**
Create a `PrivateRoute` wrapper component that redirects unauthenticated users to `/login`:

```typescript
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">...</div>;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};
```

Wrap protected routes:
```diff
- <Route path="/dashboard" element={<Dashboard geoState={geoState} />} />
+ <Route path="/dashboard" element={<PrivateRoute element={<Dashboard geoState={geoState} />} />} />
- <Route path="/contacts"  element={<ContactsPage />} />
+ <Route path="/contacts"  element={<PrivateRoute element={<ContactsPage />} />} />
- <Route path="/companion" element={<CompanionPage geoState={geoState} />} />
+ <Route path="/companion" element={<PrivateRoute element={<CompanionPage geoState={geoState} />} />} />
```

**Expected Result:** Unauthenticated users are redirected to `/login` from protected pages.

---

### Fix 2.3 — Post-Login Redirect and LoginPage Auth Redirect

**File:** `src/pages/LoginPage.tsx`

**What to change:**
1. Add redirect for already-authenticated users at mount
2. Change post-login redirect target

```diff
+ import { useEffect } from 'react';
+ const { isAuthenticated } = useAuth();
+ useEffect(() => {
+   if (isAuthenticated) navigate('/dashboard');
+ }, [isAuthenticated, navigate]);

  // Change in handleSubmit and handleDemoAccess:
- navigate('/');
+ navigate('/dashboard');
```

**Expected Result:** Logged-in users go to Dashboard; fresh logins go to Dashboard.

---

## Phase 3 — Integration Fixes

### Fix 3.1 — `ContactsPage` Auth Guard

**File:** `src/pages/ContactsPage.tsx`

**What to change:**
Add `const { isAuthenticated } = useAuth()` and a redirect effect:

```diff
+ import { useNavigate } from 'react-router-dom';
+ import { useAuth } from '../context/AuthContext.tsx';

  export const ContactsPage: React.FC = () => {
+   const { isAuthenticated } = useAuth();
+   const navigate = useNavigate();

+   useEffect(() => {
+     if (!isAuthenticated) navigate('/login');
+   }, [isAuthenticated, navigate]);

    const fetchContacts = async () => {
+     if (!isAuthenticated) return;  // Guard
      ...
    };
```

Note: With Phase 2 (`PrivateRoute`) in place, this is redundant as a protection mechanism but remains good defensive coding.

---

### Fix 3.2 — Fix `LandingPage` Dual Geolocation Instance

**File:** `src/App.tsx` + `src/pages/LandingPage.tsx`

**What to change:**
Pass `geoState` as a prop to `LandingPage`:

In `App.tsx`:
```diff
- <Route path="/" element={<LandingPage />} />
+ <Route path="/" element={<LandingPage geoState={geoState} />} />
- <Route path="/landing" element={<LandingPage />} />
+ <Route path="/landing" element={<LandingPage geoState={geoState} />} />
```

In `LandingPage.tsx`:
```diff
- export const LandingPage: React.FC = () => {
+ export const LandingPage: React.FC<{ geoState: GeolocationState }> = ({ geoState }) => {
-   const geoState = useGeolocation();
```

**Expected Result:** Only one geolocation observer is active at a time.

---

### Fix 3.3 — Fix `vite` Dependency Duplication

**File:** `package.json`

**What to change:**
```diff
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "axios": "^1.20.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.3",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-router-dom": "^7.18.3",
-   "vite": "^6.2.3"
  },
```

---

## Phase 4 — Error Handling & Edge Cases

### Fix 4.1 — Add Auth Guard to AI Route

**File:** `server/routes/aiRoutes.ts`

```diff
+ import { requireAuth } from '../middleware/auth.ts';
  export const aiRouter = Router();
+ aiRouter.use(requireAuth);
```

### Fix 4.2 — Sanitize Global Error Handler in Production

**File:** `server/app.ts`

```diff
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API Server Error:', err);
+   const isProd = process.env.NODE_ENV === 'production';
    res.status(500).json({
      error: 'Internal Server Error',
-     message: err.message || 'An unexpected error occurred',
+     message: isProd ? 'An unexpected error occurred' : (err.message || 'An unexpected error occurred'),
    });
  });
```

### Fix 4.3 — Phone Number Validation in Contacts Form

**File:** `src/pages/ContactsPage.tsx`

Add a simple regex validation before calling the API:
```typescript
const phoneRegex = /^\+?[\d\s\-()]{8,15}$/;
if (!phoneRegex.test(phone.trim())) {
  setFormError('Please enter a valid phone number with country code');
  return;
}
```

---

## Phase 5 — Security / Code Quality

### Fix 5.1 — Tighten CORS in Production

**File:** `server/app.ts`

```diff
- const allowedOrigin = process.env.APP_URL || 'http://localhost:3000';
+ const allowedOrigins = [
+   process.env.APP_URL,
+   'http://localhost:3000',
+   'http://localhost:5173',
+ ].filter(Boolean) as string[];

  app.use(cors({
    origin: (origin, cb) => {
-     if (!origin || origin === allowedOrigin) return cb(null, true);
-     cb(new Error(`CORS: Origin '${origin}' not allowed`));
+     if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
+     cb(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
  }));
```

---

## Phase 6 — Final Verification

### Automated Tests
_(No test suite is configured. The following are manual test scenarios.)_

### Manual Verification Checklist

1. **Auth Flow:**
   - [ ] Register new account → redirect to `/dashboard`
   - [ ] Demo login → redirect to `/dashboard`
   - [ ] Login with wrong password → shows error message (not blank)
   - [ ] Logout → redirect to `/login`
   - [ ] Visit `/dashboard` without login → redirect to `/login`
   - [ ] Already logged in, visit `/login` → redirect to `/dashboard`

2. **SOS Flow:**
   - [ ] Open SOS modal → dial pad attempts to open, countdown begins
   - [ ] Wait 3 seconds → SOS dispatched once (not twice)
   - [ ] Click "Send SMS Beacon Now" → dispatched once
   - [ ] Add custom note before auto-dispatch → custom note appears in dispatched message
   - [ ] Click "I'm Safe / Dismiss" during countdown → modal closes, no SOS sent
   - [ ] After dispatch, click "Mark as Resolved" → modal closes, status updated

3. **Contacts:**
   - [ ] Add contact → appears in list
   - [ ] Edit contact → changes reflected
   - [ ] Delete contact → removed from list
   - [ ] Add 6th contact → button disabled, error shown

4. **Amenities:**
   - [ ] Page loads → shows 11 simulated amenities
   - [ ] Filter by police → shows 3 police stations
   - [ ] Search by name → correctly filters
   - [ ] "Interactive Map View" → OSM iframe renders

5. **AI Companion:**
   - [ ] Send message → response received (with or without Gemini key)
   - [ ] Quick prompt buttons work
   - [ ] Grounded places shown inline for amenity queries

6. **Incidents:**
   - [ ] Unauthenticated → "Sign in to Report" gate shown (report form hidden)
   - [ ] Authenticated → can submit incident
   - [ ] Submitted incident appears in feed

---

# Ready for Implementation

## Summary

| Category | Count |
|---|---|
| **Critical Issues** | 2 (SOS race condition, stale closure) |
| **High Priority Issues** | 3 (auth error propagation, no protected routes, ContactsPage no auth) |
| **Medium Priority Issues** | 5 (login redirects, vite duplicate, dual geolocation, AI no auth, CORS) |
| **Low Priority Issues** | 3 (error sanitization, phone validation, incident data privacy) |

| Feature Category | Status |
|---|---|
| Features currently **working** | Landing Page, Login/Signup/Demo, Session Persistence, Logout, Amenities, Transport, Helpline Grid, AI Companion (with fallback), Incident Feed |
| Features **partially working** | Dashboard (works when auth'd), SOS (race condition + stale state), Contacts Page (no auth redirect) |
| Features **broken** | Protected route enforcement, Post-login redirect, Auth error display |

## Exact Fix Order (Recommended)

1. Fix `AuthContext` error re-throw (all errors propagate to UI)
2. Fix SOS double-dispatch guard (isDispatchingRef)
3. Fix `customNote` stale closure (useRef + useEffect-based countdown)
4. Add `PrivateRoute` in `App.tsx`
5. Fix `LoginPage` redirects (post-login → dashboard; auth'd user → dashboard)
6. Fix `ContactsPage` auth guard (defensive)
7. Remove `vite` from `dependencies` in `package.json`
8. Fix `LandingPage` dual geolocation (pass geoState as prop)
9. Add `requireAuth` to AI route
10. Tighten CORS configuration
11. Add phone validation in ContactsPage form
12. Sanitize error messages in production error handler
