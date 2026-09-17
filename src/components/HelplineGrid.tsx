import React, { useState } from 'react';
import { PhoneCall, Shield, Copy, Check, Info } from 'lucide-react';
import { Helpline } from '../types.ts';

const HELPLINES: Helpline[] = [
  {
    number: '1090',
    name: 'Women Power Line',
    description: 'Dedicated 24/7 cell for women against eve-teasing, harassment, and stalking.',
    category: 'women',
    badge: 'State & National Women Cell',
    color: 'border-rose-300 bg-rose-50/50 text-rose-900',
    available24x7: true,
  },
  {
    number: '112',
    name: 'National Emergency Service (ERSS)',
    description: 'Unified national emergency number for immediate Police, Fire, and Medical assistance.',
    category: 'national',
    badge: 'All-in-One Emergency',
    color: 'border-red-300 bg-red-50/50 text-red-900',
    available24x7: true,
  },
  {
    number: '181',
    name: 'National Women Helpline',
    description: 'Confidential support, legal aid, medical assistance, and domestic violence shelter.',
    category: 'women',
    badge: 'Ministry of Women & Child',
    color: 'border-pink-300 bg-pink-50/50 text-pink-900',
    available24x7: true,
  },
  {
    number: '100',
    name: 'Police Emergency PCR',
    description: 'Direct police control room dispatch for immediate on-ground response and patrol.',
    category: 'police',
    badge: 'Police Dispatch',
    color: 'border-blue-300 bg-blue-50/50 text-blue-900',
    available24x7: true,
  },
  {
    number: '108',
    name: 'Disaster & Medical Ambulance',
    description: 'Emergency response ambulance services with onboard life-support and first aid.',
    category: 'medical',
    badge: 'Free Ambulance Service',
    color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
    available24x7: true,
  },
  {
    number: '1930',
    name: 'Cyber Crime & Online Stalking',
    description: 'Reporting cyber harassment, blackmail, non-consensual image sharing, and cyber stalking.',
    category: 'cyber',
    badge: 'National Cyber Crime Portal',
    color: 'border-indigo-300 bg-indigo-50/50 text-indigo-900',
    available24x7: true,
  },
  {
    number: '1076',
    name: "Chief Minister's Emergency Helpline",
    description: 'Direct citizen grievance and rapid administrative intervention helpline.',
    category: 'national',
    badge: 'Citizen Helpdesk',
    color: 'border-amber-300 bg-amber-50/50 text-amber-900',
    available24x7: true,
  },
  {
    number: '1098',
    name: 'Childline / Young Girls Helpline',
    description: 'Emergency assistance and protection for minors, students, and young adolescents.',
    category: 'women',
    badge: 'Special Child Protection',
    color: 'border-purple-300 bg-purple-50/50 text-purple-900',
    available24x7: true,
  },
];

export const HelplineGrid: React.FC<{ limit?: number }> = ({ limit }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'women' | 'national' | 'police' | 'medical' | 'cyber'>('all');

  const displayed = HELPLINES
    .filter((h) => filter === 'all' || h.category === filter)
    .slice(0, limit || HELPLINES.length);

  const copyToClipboard = (num: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <section id="helplines-section" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Emergency Helpline Directory
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">
            Verified Indian 24/7 government safety numbers. One-tap instant connection.
          </p>
        </div>

        {/* Filter Chips */}
        {!limit && (
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Helplines' },
              { id: 'women', label: "Women's Dedicated" },
              { id: 'national', label: 'National ERSS' },
              { id: 'police', label: 'Police' },
              { id: 'medical', label: 'Medical' },
              { id: 'cyber', label: 'Cyber Safety' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  filter === f.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((item) => (
          <div
            key={item.number}
            id={`helpline-card-${item.number}`}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-rose-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {item.badge}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  24x7 Live
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-display text-rose-600 tracking-tight">
                  {item.number}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => copyToClipboard(item.number, e)}
                  title="Copy number"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  {copiedNumber === item.number ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <a
                  href={`tel:${item.number}`}
                  id={`btn-dial-${item.number}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all min-h-[44px]"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Quick Dial</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
