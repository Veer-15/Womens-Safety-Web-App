import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  X,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Radio,
  Clock,
  ShieldCheck,
  PhoneCall,
  PhoneForwarded,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { sosService } from '../services/api.ts';
import { GeolocationState } from '../hooks/useGeolocation.ts';
import { triggerEmergencyDialPad } from '../utils/emergencyDialer.ts';

interface SOSButtonModalProps {
  geoState: GeolocationState;
  onSosTriggered?: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialDialNumber?: string;
}

interface DispatchResult {
  sosId: string;
  dispatchedCount: number;
  recipients: Array<{ name: string; phone: string; status: string }>;
  mapsUrl: string;
  alertMessage: string;
  isMock: boolean;
  timestamp: string;
}

export const SOSButtonModal: React.FC<SOSButtonModalProps> = ({
  geoState,
  onSosTriggered,
  isOpen,
  onClose,
  initialDialNumber = '112',
}) => {
  const [stage, setStage] = useState<'countdown' | 'dispatching' | 'dispatched'>('countdown');
  const [countdown, setCountdown] = useState<number>(3);
  const [customNote, setCustomNote] = useState<string>('');
  const [activeDialNumber, setActiveDialNumber] = useState<string>(initialDialNumber);
  const [dialTriggerCount, setDialTriggerCount] = useState<number>(0);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // When modal opens: Immediately trigger dial pad & start countdown for GPS SMS dispatch
  useEffect(() => {
    if (isOpen) {
      setStage('countdown');
      setCountdown(3);
      setDispatchResult(null);
      setErrorMessage(null);
      setCopied(false);
      setActiveDialNumber(initialDialNumber);

      // DIRECT ACTION: Immediately trigger device dial pad with the emergency number
      triggerEmergencyDialPad(initialDialNumber);
      setDialTriggerCount((prev) => prev + 1);

      // Concurrent timer for background GPS distress SMS dispatch
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            triggerSosAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, initialDialNumber]);

  const handleDialNumber = (number: string) => {
    setActiveDialNumber(number);
    setDialTriggerCount((prev) => prev + 1);
    triggerEmergencyDialPad(number);
  };

  const cancelCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const triggerSosAlert = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('dispatching');
    setErrorMessage(null);

    try {
      const res = await sosService.triggerSOS({
        latitude: geoState.latitude,
        longitude: geoState.longitude,
        accuracy: geoState.accuracy,
        customMessage: customNote.trim() || undefined,
      });

      setDispatchResult(res);
      setStage('dispatched');
      if (onSosTriggered) onSosTriggered();
    } catch (err: any) {
      console.error('SOS dispatch error:', err);
      setErrorMessage(
        err.response?.data?.error || 'Failed to dispatch SOS alerts. Please call emergency services directly.'
      );
      setStage('countdown');
    }
  };

  const copyAlertDetails = () => {
    if (dispatchResult) {
      navigator.clipboard.writeText(dispatchResult.alertMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleResolveAlert = async (status: 'RESOLVED' | 'FALSE_ALARM') => {
    if (!dispatchResult) return;
    try {
      await sosService.updateStatus(dispatchResult.sosId, status);
      onClose();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="sos-alert-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-100 relative">
        {/* Header Bar */}
        <div className="bg-linear-to-r from-red-700 via-rose-600 to-red-600 px-6 py-4 text-white flex items-center justify-between border-b border-red-500/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-wide uppercase block leading-tight">
                Emergency Auto-Dialer &amp; SOS
              </span>
              <span className="text-[11px] text-rose-100 font-medium leading-tight">
                Direct phone dialpad triggered &bull; Live GPS tracking active
              </span>
            </div>
          </div>
          {stage !== 'dispatching' && (
            <button
              onClick={cancelCountdown}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label="Close emergency modal"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6 md:p-8">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* STAGE 1: Direct Emergency Auto-Dial Trigger HUD & Countdown */}
          {stage === 'countdown' && (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* HIGH-VISIBILITY AUTO-DIAL TRIGGER CALLOUT BOX */}
              <div
                id="emergency-auto-dial-trigger-box"
                className="w-full p-4 sm:p-5 rounded-2xl bg-linear-to-br from-red-500/10 via-rose-500/15 to-amber-500/10 border-2 border-red-500/40 text-left shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                    <Zap className="w-3 h-3 fill-current" />
                    Dial Pad Triggered Automatically
                  </span>
                  <span className="text-[11px] font-bold text-red-800 bg-red-100/80 px-2 py-0.5 rounded-md border border-red-200">
                    Dialing: {activeDialNumber}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
                    <PhoneCall className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      Opening Phone Dial Pad...
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Your phone dialer has been directly triggered with the emergency number. If your browser or device did not open it automatically, tap below immediately:
                    </p>
                  </div>
                </div>

                {/* DIRECT ACTION TRIGGER CALLOUT BUTTONS */}
                <div className="space-y-2 pt-1">
                  {/* Primary 112 Trigger */}
                  <a
                    id="btn-trigger-dial-112"
                    href="tel:112"
                    onClick={() => handleDialNumber('112')}
                    className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-lg shadow-red-600/40 border border-red-400/50 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <PhoneCall className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs uppercase font-bold text-amber-200 leading-none">Primary Emergency</div>
                        <div className="text-base sm:text-lg font-black tracking-wide leading-tight">CALL 112 (National ERSS)</div>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-red-700 font-bold shadow-xs">
                      Dial Now &rarr;
                    </span>
                  </a>

                  {/* Women's Helpline 1090 Trigger */}
                  <a
                    id="btn-trigger-dial-1090"
                    href="tel:1090"
                    onClick={() => handleDialNumber('1090')}
                    className="w-full py-3 px-4 rounded-xl bg-rose-950 hover:bg-black active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md border border-rose-800 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-800/80 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4 text-rose-200" />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] uppercase font-bold text-rose-300 leading-none">Women's Safety Special</div>
                        <div className="text-sm font-black tracking-wide leading-tight">CALL 1090 (Women Power Line)</div>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-rose-800 text-rose-100 font-semibold">
                      One-Tap &rarr;
                    </span>
                  </a>
                </div>

                {/* Smaller Other Emergency Numbers Quick Strip */}
                <div className="pt-2 border-t border-red-200/60 flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Other Quick Dials:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { num: '181', label: 'Distress' },
                      { num: '100', label: 'Police' },
                      { num: '108', label: 'Ambulance' },
                      { num: '1930', label: 'Cyber' },
                    ].map((item) => (
                      <a
                        key={item.num}
                        href={`tel:${item.num}`}
                        onClick={() => handleDialNumber(item.num)}
                        className="px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-800 font-mono text-[11px] font-bold border border-slate-200 hover:border-red-300 shadow-2xs transition-colors flex items-center gap-1"
                        title={`Dial ${item.label} (${item.num})`}
                      >
                        <PhoneCall className="w-2.5 h-2.5 text-red-600" />
                        <span>{item.num}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONCURRENT BACKGROUND GPS SMS BEACON STATUS */}
              <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xs">
                      {countdown}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Transmitting live GPS distress SMS in {countdown}s
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                    GPS ±{geoState.accuracy}m
                  </span>
                </div>

                {/* Optional note chips */}
                <div>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {['Suspicious Person', 'Unsafe Vehicle', 'Medical Urgency', 'Being Followed'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCustomNote(tag)}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                          customNote === tag
                            ? 'bg-rose-100 border-rose-400 text-rose-800 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add landmark or emergency note (optional)..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-rose-500"
                  />
                </div>

                {/* Abort vs Force Send Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id="btn-abort-sos"
                    type="button"
                    onClick={cancelCountdown}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all"
                  >
                    I'm Safe / Dismiss
                  </button>
                  <button
                    id="btn-instant-sos"
                    type="button"
                    onClick={triggerSosAlert}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send SMS Beacon Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Dispatching In Progress */}
          {stage === 'dispatching' && (
            <div className="flex flex-col items-center text-center py-10">
              <Radio className="w-16 h-16 text-rose-600 animate-spin mb-4" />
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Broadcasting Emergency Beacon...
              </h3>
              <p className="text-slate-600 text-sm mt-2 max-w-sm">
                Locking GPS coordinates and transmitting emergency SMS alert to your contacts network...
              </p>
            </div>
          )}

          {/* STAGE 3: Dispatched Success & Live Telemetry */}
          {stage === 'dispatched' && dispatchResult && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="font-display text-2xl font-bold text-slate-900">
                Emergency Alert Dispatched!
              </h3>
              <p className="text-emerald-700 text-xs font-semibold bg-emerald-50 px-3 py-1 rounded-full mt-1 border border-emerald-200">
                {dispatchResult.isMock
                  ? 'Simulated SMS Gateway Logged & Contacts Dispatched'
                  : 'Live SMS Sent via Telecom Gateway'}
              </p>

              {/* Alert Summary Box */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-4 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Time:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(dispatchResult.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5" /> Coordinates:
                  </span>
                  <a
                    href={dispatchResult.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    Open Live Google Map <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Recipients Dispatched:</span>
                  <div className="space-y-1">
                    {dispatchResult.recipients.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                      >
                        <span className="font-medium text-slate-800">{r.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-slate-500 block mb-1">Dispatched Message:</span>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px] break-words">
                    {dispatchResult.alertMessage}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="w-full mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={copyAlertDetails}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied Text!' : 'Copy Alert'}</span>
                </button>
                <a
                  href={dispatchResult.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </a>
              </div>

              {/* Mark Status */}
              <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleResolveAlert('FALSE_ALARM')}
                  className="py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Mark False Alarm
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveAlert('RESOLVED')}
                  className="py-2 text-xs text-emerald-700 font-bold hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mark as Resolved</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
