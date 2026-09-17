import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { useGeolocation } from './hooks/useGeolocation.ts';
import { Navbar } from './components/Navbar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { SOSButtonModal } from './components/SOSButtonModal.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AmenitiesPage } from './pages/AmenitiesPage.tsx';
import { TransportPage } from './pages/TransportPage.tsx';
import { CompanionPage } from './pages/CompanionPage.tsx';
import { ContactsPage } from './pages/ContactsPage.tsx';
import { IncidentsPage } from './pages/IncidentsPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { LandingPage } from './pages/LandingPage.tsx';

const AppContent: React.FC = () => {
  const geoState = useGeolocation();
  const [globalSosOpen, setGlobalSosOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-rose-100 selection:text-rose-900">
      {/* Top Navbar */}
      <Navbar
        geoStatus={geoState.status}
        accuracy={geoState.accuracy}
        onOpenSosModal={() => setGlobalSosOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard geoState={geoState} />} />
          <Route path="/app" element={<Dashboard geoState={geoState} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/amenities" element={<AmenitiesPage geoState={geoState} />} />
          <Route path="/transport" element={<TransportPage geoState={geoState} />} />
          <Route path="/companion" element={<CompanionPage geoState={geoState} />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/incidents" element={<IncidentsPage geoState={geoState} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Thumb Navigation */}
      <BottomNav onOpenSosModal={() => setGlobalSosOpen(true)} />

      {/* Global SOS Modal */}
      <SOSButtonModal
        isOpen={globalSosOpen}
        onClose={() => setGlobalSosOpen(false)}
        geoState={geoState}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
