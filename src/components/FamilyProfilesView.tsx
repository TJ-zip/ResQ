import React, { useState } from 'react';
import { FamilyProfile, EmergencyContact } from '../types';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  AlertTriangle,
  ArrowLeft,
  Heart,
  Pill,
  ShieldCheck,
  Building2,
  Phone,
  HelpCircle,
} from 'lucide-react';

interface FamilyProfilesViewProps {
  profiles: FamilyProfile[];
  selectedProfileId: string;
  onSelectProfile: (id: string) => void;
  onSaveProfile: (profile: FamilyProfile) => void;
  onDeleteProfile: (id: string) => void;
  onBack: () => void;
}

export const FamilyProfilesView: React.FC<FamilyProfilesViewProps> = ({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
  onBack,
}) => {
  const [editingProfile, setEditingProfile] = useState<FamilyProfile | null>(null);
  const [previewProfile, setPreviewProfile] = useState<FamilyProfile | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for adding/editing
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formAgeRange, setFormAgeRange] = useState('30–35 years');
  const [formBloodGroup, setFormBloodGroup] = useState('B+');
  const [formConditions, setFormConditions] = useState('');
  const [formAllergies, setFormAllergies] = useState('');
  const [formMedicines, setFormMedicines] = useState('');
  const [formInsuranceProvider, setFormInsuranceProvider] = useState('');
  const [formInsurancePolicyRef, setFormInsurancePolicyRef] = useState('');
  const [formHospitalPreference, setFormHospitalPreference] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formContacts, setFormContacts] = useState<EmergencyContact[]>([
    { id: '1', name: '', relationship: '', phone: '' },
  ]);

  const openEditModal = (profile: FamilyProfile) => {
    setEditingProfile(profile);
    setIsCreatingNew(false);
    setFormDisplayName(profile.displayName);
    setFormAgeRange(profile.ageRange);
    setFormBloodGroup(profile.bloodGroup || 'Unknown');
    setFormConditions(profile.conditions.join(', '));
    setFormAllergies(profile.allergies.join(', '));
    setFormMedicines(profile.medicines.join(', '));
    setFormInsuranceProvider(profile.insuranceProvider || '');
    setFormInsurancePolicyRef(profile.insurancePolicyRef || '');
    setFormHospitalPreference(profile.hospitalPreference || '');
    setFormNotes(profile.notes || '');
    setFormContacts(
      profile.emergencyContacts.length > 0
        ? [...profile.emergencyContacts]
        : [{ id: '1', name: '', relationship: '', phone: '' }]
    );
  };

  const openCreateModal = () => {
    setEditingProfile(null);
    setIsCreatingNew(true);
    setFormDisplayName('');
    setFormAgeRange('30–35 years');
    setFormBloodGroup('Unknown');
    setFormConditions('');
    setFormAllergies('');
    setFormMedicines('');
    setFormInsuranceProvider('');
    setFormInsurancePolicyRef('');
    setFormHospitalPreference('');
    setFormNotes('');
    setFormContacts([
      { id: Date.now().toString(), name: '', relationship: 'Family Member', phone: '+91 ' },
    ]);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDisplayName.trim()) return;

    const parsedConditions = formConditions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedAllergies = formAllergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedMedicines = formMedicines
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const filteredContacts = formContacts.filter(
      (c) => c.name.trim() || c.phone.trim()
    );

    const savedProfile: FamilyProfile = {
      id: editingProfile ? editingProfile.id : `prof-${Date.now()}`,
      displayName: formDisplayName.trim(),
      ageRange: formAgeRange,
      bloodGroup: formBloodGroup,
      conditions: parsedConditions,
      allergies: parsedAllergies,
      medicines: parsedMedicines,
      insuranceProvider: formInsuranceProvider.trim(),
      insurancePolicyRef: formInsurancePolicyRef.trim(),
      hospitalPreference: formHospitalPreference.trim(),
      notes: formNotes.trim(),
      emergencyContacts: filteredContacts,
      isSyntheticPreset: false,
    };

    onSaveProfile(savedProfile);
    setEditingProfile(null);
    setIsCreatingNew(false);
  };

  const addContactRow = () => {
    setFormContacts([
      ...formContacts,
      { id: Date.now().toString(), name: '', relationship: '', phone: '+91 ' },
    ]);
  };

  const updateContactRow = (index: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...formContacts];
    updated[index] = { ...updated[index], [field]: value };
    setFormContacts(updated);
  };

  const removeContactRow = (index: number) => {
    if (formContacts.length <= 1) return;
    setFormContacts(formContacts.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#8E959E] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Emergency Home</span>
        </button>
        <button
          onClick={openCreateModal}
          className="min-h-[44px] px-4 py-2 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Fictional Profile</span>
        </button>
      </div>

      {/* Intro Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-[#EB232D]" />
          <span>Patient & Family Profiles</span>
        </h1>
        <p className="text-xs text-[#8E959E] mt-1 max-w-2xl leading-relaxed">
          Pre-configure essential health summaries for yourself or family members. During an incident, selecting a profile provides responders and hospitals with a concise, self-reported handover without typing under stress.
        </p>
      </div>

      {/* Self-entered disclaimer badge */}
      <div className="p-3 rounded-xl bg-[#24272B] border border-[#383D43] flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-[#8E959E] leading-relaxed">
          <span className="font-semibold text-white">Notice on synthetic demo data:</span> All entries are marked{' '}
          <span className="text-amber-300 font-semibold">“Patient/family reported — not clinically verified”</span>. ResQ does not verify official medical records, and only stores what is needed for handover coordination.
        </div>
      </div>

      {/* Profile List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => {
          const isSelected = profile.id === selectedProfileId;
          return (
            <div
              key={profile.id}
              className={`rounded-2xl p-5 border transition-all ${
                isSelected
                  ? 'bg-[#1C1F22] border-[#EB232D] shadow-lg shadow-[#EB232D]/5 ring-1 ring-[#EB232D]'
                  : 'bg-[#181A1D] border-[#2A2E34] hover:border-[#383D43]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#2A2E34]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white leading-tight">
                      {profile.displayName}
                    </h2>
                    {profile.isSyntheticPreset && (
                      <span className="text-[10px] bg-[#24272B] text-[#8E959E] px-1.5 py-0.5 rounded border border-[#383D43]">
                        Synthetic Preset
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8E959E] mt-0.5">
                    {profile.ageRange} · Blood Group: {profile.bloodGroup}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewProfile(profile)}
                    className="p-2 rounded-lg text-[#8E959E] hover:text-white hover:bg-[#24272B] transition-colors"
                    title="Preview Sharing View"
                    aria-label="Preview Sharing View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(profile)}
                    className="p-2 rounded-lg text-[#8E959E] hover:text-white hover:bg-[#24272B] transition-colors"
                    title="Edit Profile"
                    aria-label="Edit Profile"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove demo profile for ${profile.displayName}?`)) {
                          onDeleteProfile(profile.id);
                        }
                      }}
                      className="p-2 rounded-lg text-[#8E959E] hover:text-red-400 hover:bg-[#24272B] transition-colors"
                      title="Delete Profile"
                      aria-label="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Summary attributes */}
              <div className="py-3 space-y-2 text-xs">
                <div>
                  <span className="text-[#8E959E]">Reported conditions: </span>
                  <span className="text-[#F4F5F7]">
                    {profile.conditions.length > 0 ? profile.conditions.join(', ') : 'None reported'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8E959E]">Allergies: </span>
                  <span className={profile.allergies.length > 0 ? 'text-amber-300 font-medium' : 'text-[#F4F5F7]'}>
                    {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None reported'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8E959E]">Medicines: </span>
                  <span className="text-[#F4F5F7]">
                    {profile.medicines.length > 0 ? profile.medicines.join(', ') : 'None reported'}
                  </span>
                </div>
                {profile.hospitalPreference && (
                  <div>
                    <span className="text-[#8E959E]">Hospital preference: </span>
                    <span className="text-[#F4F5F7] font-medium">{profile.hospitalPreference}</span>
                  </div>
                )}
                {profile.emergencyContacts.length > 0 && (
                  <div className="pt-1 flex items-center gap-1 text-[#8E959E]">
                    <Phone className="w-3 h-3 text-[#EB232D]" />
                    <span>
                      Primary: {profile.emergencyContacts[0].name} ({profile.emergencyContacts[0].relationship}) - {profile.emergencyContacts[0].phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Selection button */}
              <div className="pt-2 border-t border-[#2A2E34] flex items-center justify-between">
                <span className="text-[10px] text-[#8E959E] uppercase tracking-wider">
                  Patient/family reported
                </span>
                {isSelected ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#EB232D] bg-[#EB232D]/10 px-3 py-1 rounded-full border border-[#EB232D]/30">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Emergency Profile</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectProfile(profile.id)}
                    className="text-xs font-medium text-white hover:text-[#EB232D] px-3 py-1 rounded-md border border-[#383D43] hover:border-[#EB232D] transition-colors"
                  >
                    Select for Incidents
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sharing Preview Modal */}
      {previewProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181A1D] border border-[#383D43] rounded-2xl max-w-xl w-full p-6 text-[#F4F5F7] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E34]">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#EB232D]" />
                <h3 className="font-bold text-base text-white">
                  Sharing Preview — Authorized Responder View
                </h3>
              </div>
              <button
                onClick={() => setPreviewProfile(null)}
                className="text-xs text-[#8E959E] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#24272B] border border-[#383D43] text-xs text-[#8E959E]">
              This is the exact structured view an authorized responder or triage nurse receives during an incident. ResQ only shares what is strictly necessary to prevent clinical medication conflicts.
            </div>

            <div className="mt-4 space-y-4">
              <div className="bg-[#141618] p-4 rounded-xl border border-[#2A2E34]">
                <div className="flex justify-between items-baseline">
                  <div className="text-xl font-black text-white">{previewProfile.displayName}</div>
                  <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                    Patient/Family Reported
                  </span>
                </div>
                <div className="text-xs text-[#8E959E] mt-1">
                  Age Group: {previewProfile.ageRange} · Blood Group: {previewProfile.bloodGroup}
                </div>
              </div>

              <div className="bg-[#141618] p-4 rounded-xl border border-[#2A2E34] space-y-2 text-xs">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#EB232D]" />
                  <span>Reported Conditions & Allergies</span>
                </div>
                <div>
                  <span className="text-[#8E959E]">Known Conditions: </span>
                  <span className="text-white font-medium">
                    {previewProfile.conditions.join(', ') || 'None reported'}
                  </span>
                </div>
                <div className="p-2 bg-red-950/40 border border-red-600/30 rounded text-red-200">
                  <span className="font-bold">Reported Allergies: </span>
                  <span>{previewProfile.allergies.join(', ') || 'None reported'}</span>
                </div>
                <div>
                  <span className="text-[#8E959E]">Current Medicines: </span>
                  <span className="text-white font-medium">
                    {previewProfile.medicines.join(', ') || 'None reported'}
                  </span>
                </div>
              </div>

              <div className="bg-[#141618] p-4 rounded-xl border border-[#2A2E34] space-y-2 text-xs">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8E959E]" />
                  <span>Insurance & Preferences (For Hospital Verification)</span>
                </div>
                <div>
                  <span className="text-[#8E959E]">Provider: </span>
                  <span className="text-white">{previewProfile.insuranceProvider || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#8E959E]">Policy Ref: </span>
                  <span className="text-white">{previewProfile.insurancePolicyRef || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#8E959E]">Hospital Preference: </span>
                  <span className="text-white font-medium">{previewProfile.hospitalPreference || 'Not provided'}</span>
                  <div className="text-[11px] text-[#8E959E] mt-0.5 italic">
                    (Family preference only — not a destination guarantee)
                  </div>
                </div>
              </div>

              <div className="bg-[#141618] p-4 rounded-xl border border-[#2A2E34] space-y-2 text-xs">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#EB232D]" />
                  <span>Emergency Contacts</span>
                </div>
                {previewProfile.emergencyContacts.map((c) => (
                  <div key={c.id} className="flex justify-between items-center py-1 border-b border-[#24272B] last:border-0">
                    <div>
                      <span className="font-semibold text-white">{c.name}</span>{' '}
                      <span className="text-[#8E959E]">({c.relationship})</span>
                    </div>
                    <span className="font-mono text-white">{c.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setPreviewProfile(null)}
                className="px-4 py-2 bg-white text-[#141618] font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(editingProfile || isCreatingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181A1D] border border-[#383D43] rounded-2xl max-w-2xl w-full p-6 text-[#F4F5F7] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E34]">
              <h3 className="font-bold text-lg text-white">
                {isCreatingNew ? 'Create Fictional Family Profile' : `Edit Profile: ${formDisplayName}`}
              </h3>
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setIsCreatingNew(false);
                }}
                className="text-xs text-[#8E959E] hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[#8E959E] mb-1 font-semibold">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={formDisplayName}
                    onChange={(e) => setFormDisplayName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8E959E] mb-1 font-semibold">
                    Age Range
                  </label>
                  <select
                    value={formAgeRange}
                    onChange={(e) => setFormAgeRange(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                  >
                    <option value="Child (0–12 years)">Child (0–12)</option>
                    <option value="Teen (13–19 years)">Teen (13–19)</option>
                    <option value="Young Adult (20–29 years)">Young Adult (20–29)</option>
                    <option value="Adult (30–45 years)">Adult (30–45)</option>
                    <option value="Mature Adult (46–59 years)">Mature Adult (46–59)</option>
                    <option value="Elderly (60+ years)">Elderly (60+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8E959E] mb-1 font-semibold">
                  Blood Group (Optional / Self-Reported)
                </label>
                <input
                  type="text"
                  placeholder="e.g. B+ or O+ (Self-reported)"
                  value={formBloodGroup}
                  onChange={(e) => setFormBloodGroup(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E959E] mb-1 font-semibold">
                  Known Conditions (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                  value={formConditions}
                  onChange={(e) => setFormConditions(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
                <span className="text-[11px] text-[#8E959E]">
                  Reported by patient or carer. ResQ does not verify official diagnoses.
                </span>
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-semibold">
                  Allergies (Critical: comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, Sulfa drugs, NSAIDs"
                  value={formAllergies}
                  onChange={(e) => setFormAllergies(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E959E] mb-1 font-semibold">
                  Current Routine Medicines (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
                  value={formMedicines}
                  onChange={(e) => setFormMedicines(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[#8E959E] mb-1 font-semibold">
                    Insurance Provider (Optional reference)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Star Health, HDFC ERGO, ICICI Lombard"
                    value={formInsuranceProvider}
                    onChange={(e) => setFormInsuranceProvider(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8E959E] mb-1 font-semibold">
                    Policy Number / Ref (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SH-8921-X3"
                    value={formInsurancePolicyRef}
                    onChange={(e) => setFormInsurancePolicyRef(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8E959E] mb-1 font-semibold">
                  Hospital Preference (Optional preference only)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Manipal Hospital, Old Airport Rd or Apollo, Bannerghatta"
                  value={formHospitalPreference}
                  onChange={(e) => setFormHospitalPreference(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
                <span className="text-[11px] text-[#8E959E]">
                  Preference is recorded for the family. Destination decisions remain strictly with paramedics & triage.
                </span>
              </div>

              {/* Emergency Contacts */}
              <div className="pt-2 border-t border-[#2A2E34]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-semibold">Emergency Contacts</label>
                  <button
                    type="button"
                    onClick={addContactRow}
                    className="text-[11px] text-[#EB232D] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another Contact</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formContacts.map((contact, index) => (
                    <div key={contact.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={contact.name}
                        onChange={(e) => updateContactRow(index, 'name', e.target.value)}
                        className="flex-1 h-9 px-2 rounded bg-[#141618] border border-[#2E3339] text-white"
                      />
                      <input
                        type="text"
                        placeholder="Relationship (e.g. Spouse)"
                        value={contact.relationship}
                        onChange={(e) => updateContactRow(index, 'relationship', e.target.value)}
                        className="w-32 h-9 px-2 rounded bg-[#141618] border border-[#2E3339] text-white"
                      />
                      <input
                        type="tel"
                        placeholder="+91 Phone"
                        value={contact.phone}
                        onChange={(e) => updateContactRow(index, 'phone', e.target.value)}
                        className="w-36 h-9 px-2 rounded bg-[#141618] border border-[#2E3339] text-white"
                      />
                      {formContacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContactRow(index)}
                          className="p-1 text-[#8E959E] hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#8E959E] mb-1 font-semibold">
                  Additional Notes (e.g. language comfort, mobility)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Speaks Hindi and Kannada; uses walking cane"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#2A2E34] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 text-xs text-[#8E959E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
