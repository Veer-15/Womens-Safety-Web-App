import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Star,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  X,
  Shield,
  HeartHandshake,
} from 'lucide-react';
import { contactService } from '../services/api.ts';
import { EmergencyContact, ContactRelation } from '../types.ts';

export const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [relation, setRelation] = useState<ContactRelation>('Parent');
  const [priority, setPriority] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const relations: ContactRelation[] = [
    'Parent',
    'Sibling',
    'Friend',
    'Guardian',
    'Spouse',
    'Other',
  ];

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await contactService.getContacts();
      setContacts(data.contacts);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('+91 ');
    setRelation('Parent');
    setPriority(contacts.length + 1);
    setIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (c: EmergencyContact) => {
    setEditingContact(c);
    setName(c.name);
    setPhone(c.phone);
    setRelation(c.relation);
    setPriority(c.priority);
    setIsActive(c.isActive);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !phone.trim()) {
      setFormError('Name and phone number are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingContact) {
        await contactService.updateContact(editingContact.id, {
          name: name.trim(),
          phone: phone.trim(),
          relation,
          priority,
          isActive,
        });
      } else {
        await contactService.addContact({
          name: name.trim(),
          phone: phone.trim(),
          relation,
          priority,
          isActive,
        });
      }
      setModalOpen(false);
      fetchContacts();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to save emergency contact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async (id: string, contactName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${contactName} from your emergency alerts?`)) {
      return;
    }

    try {
      await contactService.deleteContact(id);
      fetchContacts();
    } catch (err) {
      console.error('Delete contact failed:', err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await contactService.updateStatus(id, !currentStatus);
      fetchContacts();
    } catch (err) {
      console.error('Toggle status failed:', err);
    }
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Emergency SOS Contacts
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {contacts.length} / 5 Contacts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            These trusted people receive your live Google Maps location instantly upon SOS activation
          </p>
        </div>

        <button
          id="btn-add-contact"
          onClick={openAddModal}
          disabled={contacts.length >= 5}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto min-h-[44px]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* Warning banner if < 2 contacts */}
      {contacts.length < 2 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">Safety Network Incomplete</p>
            <p className="text-xs text-amber-700 mt-0.5">
              You currently have only {contacts.length} contact registered. We advise having at least 2 primary guardians to ensure multi-channel reachability.
            </p>
          </div>
        </div>
      )}

      {/* Contacts List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-40"></div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
          <HeartHandshake className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-slate-800">No Contacts Added Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Add parents, siblings, or trusted guardians so they can receive rapid distress SMS alerts.
          </p>
          <button
            onClick={openAddModal}
            className="mt-5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Add First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                contact.isActive
                  ? 'border-slate-200 shadow-xs'
                  : 'border-slate-200 shadow-xs opacity-60 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {contact.relation}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${contact.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {contact.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-slate-900">{contact.name}</h3>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-lg">P{contact.priority}</span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-slate-600 text-xs">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-mono font-medium">{contact.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${contact.phone}`}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Directly</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleStatus(contact.id, contact.isActive)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium"
                    title={contact.isActive ? "Disable Contact" : "Enable Contact"}
                  >
                    {contact.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => openEditModal(contact)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id, contact.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (with Country Code) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Relationship <span className="text-rose-500">*</span>
                </label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value as ContactRelation)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-rose-500 focus:ring-1 focus:ring-rose-500 bg-white"
                >
                  {relations.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div className="flex items-center justify-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {submitting ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
