import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Send,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GeolocationState } from '../hooks/useGeolocation.ts';
import { incidentService } from '../services/api.ts';
import { Incident, IncidentCategory } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface IncidentsPageProps {
  geoState: GeolocationState;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({ geoState }) => {
  const { isAuthenticated } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<IncidentCategory>('Poor Lighting');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories: IncidentCategory[] = [
    'Harassment',
    'Suspicious Activity',
    'Poor Lighting',
    'Stalking',
    'Unsafe Transit',
    'Other',
  ];

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentService.getIncidents();
      setIncidents(data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setSuccessNotice(null);

    try {
      await incidentService.reportIncident({
        category,
        description: description.trim(),
        location: {
          latitude: geoState.latitude,
          longitude: geoState.longitude,
          address: address.trim() || undefined,
        },
      });

      setDescription('');
      setAddress('');
      setSuccessNotice('Incident logged safely. It is now visible to other women in the area.');
      fetchIncidents();
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to submit report. Please try again.';
      console.error('Failed to report incident:', err);
      setSuccessNotice(null);
      // Reuse successNotice slot as a simple error display
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIncidents = incidents.filter(
    (inc) => categoryFilter === 'all' || inc.category === categoryFilter
  );

  const getCategoryColor = (cat: IncidentCategory) => {
    switch (cat) {
      case 'Harassment':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Stalking':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Poor Lighting':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Suspicious Activity':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Unsafe Transit':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Community Safety & Incident Registry
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Citizen Reported
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Crowdsourced hazard reporting to help other women avoid dark corners, harassment hotspots, or unsafe transit points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Report a Safety Concern</h2>
              <p className="text-xs text-slate-500">Fast, confidential community log</p>
            </div>
          </div>

          {/* Auth gate: only show form to logged-in users */}
          {!isAuthenticated ? (
            <div className="py-8 text-center">
              <Lock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Sign in to Report</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Only verified members can submit community safety reports.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Sign In / Create Account
              </Link>
            </div>
          ) : (<>

          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Incident Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-rose-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Landmark or Street Address
              </label>
              <input
                type="text"
                placeholder="e.g. Near Gate 3, Metro Overbridge"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-rose-500"
              />
            </div>

            {/* GPS Telemetry Attachment */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>
                  Attached GPS: {geoState.latitude.toFixed(4)}, {geoState.longitude.toFixed(4)}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Geo-Verified
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what occurred, lighting conditions, or any safety precautions others should take..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Post Community Report'}</span>
            </button>
          </form>
          </>)}
        </div>

        {/* Incidents Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">
                Recent Safety Logs ({filteredIncidents.length})
              </span>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="w-3 h-3" />
              </span>
              {['all', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Logs' : cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse h-28" />
              ))}
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">Area Looks Clear</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                No recent incidents reported under this category.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                          incident.category
                        )}`}
                      >
                        {incident.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {incident.userName || 'Anonymous Woman'}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(incident.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {incident.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{incident.location.address}</span>
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline font-semibold text-[11px]"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
