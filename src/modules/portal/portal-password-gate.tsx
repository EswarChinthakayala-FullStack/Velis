import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { portalPasswordSchema, type PortalPasswordFormValues } from './lib/validators/portal-password.schema';
import { PasswordCard } from './components/PasswordCard';
import { PasswordHeader } from './components/PasswordHeader';
import { PasswordField } from './components/PasswordField';
import { PasswordFooter } from './components/PasswordFooter';
import { PortalSecurityNotice } from './components/PortalSecurityNotice';
import { PortalPasswordError } from './components/PortalPasswordError';
import { AmbientBackground } from '../../components/ui/AmbientBackground';

export interface PortalPasswordGateProps {
  token: string;
  onSubmitPassword: (password: string) => Promise<void> | void;
  error?: string | null;
  isLoading?: boolean;
  projectName?: string | null;
}

export const PortalPasswordGate: React.FC<PortalPasswordGateProps> = ({
  onSubmitPassword,
  error,
  isLoading = false,
  projectName,
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<PortalPasswordFormValues>({
    resolver: zodResolver(portalPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (values: PortalPasswordFormValues) => {
    if (isLoading) return;
    await onSubmitPassword(values.password.trim());
  };

  return (
    <div className="relative min-h-screen w-full bg-[#020203] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans overflow-hidden">
      {/* Velis Architectural Ambient Background */}
      <AmbientBackground />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-[1] pointer-events-none" />

      <div className="relative z-10 w-full flex justify-center">
        <PasswordCard isError={Boolean(error)}>
          {/* Header */}
          <PasswordHeader projectName={projectName} />

          {/* Error Callout */}
          <PortalPasswordError message={error || errors.password?.message} />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />

            <PasswordFooter isLoading={isLoading} />
          </form>

          {/* Read-Only Security Notice */}
          <PortalSecurityNotice />
        </PasswordCard>
      </div>
    </div>
  );
};

export default PortalPasswordGate;
