import React, { useState, useRef } from 'react';
import { useProfileSettings, useUpdateProfile } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsInput } from './settings-input';
import { SettingsSelect } from './settings-select';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Upload01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

export const ProfileSettingsSection: React.FC = () => {
  const { data: profile, isLoading } = useProfileSettings();
  const updateMutation = useUpdateProfile();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    avatarUrl: profile?.avatarUrl || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    company: profile?.company || '',
    website: profile?.website || '',
    githubUsername: profile?.githubUsername || '',
    country: profile?.country || 'United States',
    timezone: profile?.timezone || 'UTC',
    preferredLanguage: profile?.preferredLanguage || 'en',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        avatarUrl: profile.avatarUrl || '',
        username: profile.username || '',
        bio: profile.bio || '',
        company: profile.company || '',
        website: profile.website || '',
        githubUsername: profile.githubUsername || '',
        country: profile.country || 'United States',
        timezone: profile.timezone || 'UTC',
        preferredLanguage: profile.preferredLanguage || 'en',
      });
    }
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/40 h-64 flex items-center justify-center">
        <RadialSpinner size={24} className="text-zinc-500" />
      </div>
    );
  }

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        if (base64Data) {
          setFormData((prev) => ({ ...prev, avatarUrl: base64Data }));
          await updateMutation.mutateAsync({ ...formData, avatarUrl: base64Data });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileSelect}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
      />

      <SettingsCard title="Administrator Identity" description="Public profile metadata and developer contact information.">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-zinc-800/40">
          <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-lg overflow-hidden shrink-0 shadow-lg">
            {formData.avatarUrl || profile.avatarUrl ? (
              <img src={formData.avatarUrl || profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <HugeiconsIcon icon={UserIcon} size={28} />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white font-sans">{formData.fullName || profile.fullName || 'Admin User'}</h4>
            <p className="text-[11px] text-zinc-400 font-mono">{formData.email || profile.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-7 px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RadialSpinner size={12} className="text-zinc-300" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Upload01Icon} size={12} />
                    <span>Upload Avatar</span>
                  </>
                )}
              </button>
              <span className="text-[10px] text-zinc-500 font-mono">JPG, PNG, WebP up to 5MB</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <SettingsInput
            label="Full Name *"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <SettingsInput
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <SettingsInput
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="e.g. eswarchinthakayala"
          />
          <SettingsInput
            label="Company / Agency Name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. EsFlow Systems & Media"
          />
          <SettingsInput
            label="Website URL"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://esflow.studio"
          />
          <SettingsInput
            label="GitHub Handle"
            value={formData.githubUsername}
            onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
            placeholder="e.g. eswar-dev"
          />
        </div>

        <div className="pt-3">
          <label className="block text-xs font-bold text-zinc-300 font-sans pb-1">
            Bio / Agency Description
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Brief bio or description of developer responsibilities..."
            rows={3}
            className="w-full p-3 rounded-lg bg-[#0c0c0e] border border-zinc-800 text-white text-xs placeholder-zinc-500 font-mono outline-none focus:border-zinc-500 transition-colors custom-scrollbar"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Regional Preferences" description="Country and timezone configuration for audit logs.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SettingsInput
            label="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
          <SettingsSelect
            label="Timezone"
            value={formData.timezone}
            onValueChange={(val) => setFormData({ ...formData, timezone: val })}
            options={[
              { value: 'UTC', label: 'UTC' },
              { value: 'America/New_York', label: 'Eastern Time (ET)' },
              { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
              { value: 'Europe/London', label: 'London (GMT)' },
              { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
            ]}
          />
          <SettingsSelect
            label="Preferred Language"
            value={formData.preferredLanguage}
            onValueChange={(val) => setFormData({ ...formData, preferredLanguage: val })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
          />
        </div>
      </SettingsCard>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saveSuccess && (
          <span className="text-xs text-emerald-400 font-mono inline-flex items-center gap-1 animate-pulse">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Profile saved successfully</span>
          </span>
        )}
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono transition-colors cursor-pointer shadow-md disabled:opacity-50 inline-flex items-center justify-center gap-1.5 min-w-[140px]"
        >
          {updateMutation.isPending ? (
            <>
              <RadialSpinner size={13} className="text-black" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Profile Changes</span>
          )}
        </button>
      </div>
    </form>
  );
};
