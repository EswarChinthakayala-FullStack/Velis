import React from 'react';
import { type UseFormReturn, Controller } from 'react-hook-form';
import type { ClientFormValues } from '../schemas/client.schema';
import { CountrySelect } from './CountrySelect';
import { TimezoneSelect } from './TimezoneSelect';
import { SocialLinksEditor } from './SocialLinksEditor';

interface ClientFormProps {
  form: UseFormReturn<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void;
  children?: React.ReactNode;
}

export const ClientForm: React.FC<ClientFormProps> = ({ form, onSubmit, children }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      id="client-drawer-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto p-6 pb-12 space-y-6 text-xs custom-scrollbar"
    >
      {/* 1. Basic Information Section */}
      <div className="space-y-3.5">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold pb-1 border-b border-zinc-800/40">
          Basic Information
        </h4>

        {/* Client Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-300 pb-0.5">
            Client Name <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="e.g. Sarah Connor"
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors"
          />
          {errors.name && <p className="text-[11px] text-rose-400 font-mono pt-1">{errors.name.message}</p>}
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-300 pb-0.5">Company Name</label>
          <input
            {...register('company')}
            placeholder="e.g. Cyberdyne Systems"
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 pb-0.5">Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="sarah@cyberdyne.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors"
            />
            {errors.email && <p className="text-[11px] text-rose-400 font-mono pt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 pb-0.5">Phone</label>
            <input
              {...register('phone')}
              placeholder="+1 (555) 019-2834"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Location & Timezone Section */}
      <div className="space-y-3.5 pt-3 border-t border-zinc-800/60">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold pb-1 border-b border-zinc-800/40">
          Location & Timezone
        </h4>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 pb-0.5">Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CountrySelect value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 pb-0.5">Timezone</label>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <TimezoneSelect value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </div>

      {/* 3. Online Presence Section */}
      <div className="space-y-3.5 pt-3 border-t border-zinc-800/60">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold pb-1 border-b border-zinc-800/40">
          Web & Integrations
        </h4>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 pb-0.5">Website URL</label>
            <input
              {...register('website')}
              placeholder="https://cyberdyne.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors"
            />
            {errors.website && <p className="text-[11px] text-rose-400 font-mono pt-1">{errors.website.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 pb-0.5">GitHub Username</label>
            <input
              {...register('githubUsername')}
              placeholder="cyberdyne-org"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors"
            />
            {errors.githubUsername && (
              <p className="text-[11px] text-rose-400 font-mono pt-1">{errors.githubUsername.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. Social Links */}
      <SocialLinksEditor register={register} />

      {/* 5. Notes */}
      <div className="space-y-1.5 pt-3 border-t border-zinc-800/60">
        <label className="block text-xs font-semibold text-zinc-300 pb-0.5">Notes & Scope Agreements</label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Contact preferences, milestone billing notes, or security agreements..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white outline-none transition-colors resize-none"
        />
      </div>

      {children}
    </form>
  );
};

export default ClientForm;
