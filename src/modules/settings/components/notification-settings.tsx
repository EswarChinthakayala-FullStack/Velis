import React from 'react';
import { useNotificationSettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsSwitch } from './settings-switch';
import type { NotificationSettings } from '../types/settings';

export const NotificationSettingsSection: React.FC = () => {
  const { data: notifications, isLoading } = useNotificationSettings();
  const updateMutation = useUpdateSettingKey<NotificationSettings>();

  if (isLoading || !notifications) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleChannelToggle = (channel: keyof NotificationSettings['channels'], checked: boolean) => {
    const updated: NotificationSettings = {
      ...notifications,
      channels: {
        ...notifications.channels,
        [channel]: checked,
      },
    };
    updateMutation.mutate({ key: 'notifications', value: updated });
  };

  const handleEventToggle = (eventKey: keyof NotificationSettings['events'], checked: boolean) => {
    const updated: NotificationSettings = {
      ...notifications,
      events: {
        ...notifications.events,
        [eventKey]: checked,
      },
    };
    updateMutation.mutate({ key: 'notifications', value: updated });
  };

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Delivery Channels */}
      <SettingsCard title="Notification Channels" description="Configure active delivery channels for system alerts.">
        <div className="space-y-2">
          <SettingsSwitch
            label="In-App Notification Center"
            description="Displays alert badges and notification center history within EsFlow."
            checked={notifications.channels.inApp}
            onChange={(checked) => handleChannelToggle('inApp', checked)}
          />
          <SettingsSwitch
            label="Email Notifications"
            description="Sends instant email alerts to your registered administrator email address."
            checked={notifications.channels.email}
            onChange={(checked) => handleChannelToggle('email', checked)}
          />
          <SettingsSwitch
            label="Browser Push Notifications"
            description="Sends OS-level push notifications when browser tab is active or in background."
            checked={notifications.channels.browser}
            onChange={(checked) => handleChannelToggle('browser', checked)}
          />
        </div>
      </SettingsCard>

      {/* Project & Client Events */}
      <SettingsCard title="Project & Client Events" description="Alert triggers for workspace lifecycle and client onboarding.">
        <div className="space-y-2">
          <SettingsSwitch
            label="New Project Created"
            description="Notify when a new project workspace is initialized."
            checked={notifications.events.projectCreated}
            onChange={(checked) => handleEventToggle('projectCreated', checked)}
          />
          <SettingsSwitch
            label="Project Status & Scope Updates"
            description="Notify when project details, tech stack, or status change."
            checked={notifications.events.projectUpdated}
            onChange={(checked) => handleEventToggle('projectUpdated', checked)}
          />
          <SettingsSwitch
            label="Deadline Changed"
            description="Notify when a milestone or project deadline date is shifted."
            checked={notifications.events.deadlineChanged}
            onChange={(checked) => handleEventToggle('deadlineChanged', checked)}
          />
          <SettingsSwitch
            label="Client Account Added"
            description="Notify when a new client organization profile is created."
            checked={notifications.events.clientAdded}
            onChange={(checked) => handleEventToggle('clientAdded', checked)}
          />
        </div>
      </SettingsCard>

      {/* Financial & Delivery Events */}
      <SettingsCard title="Payments, Deliverables & Security" description="Financial transactions, portal access, and deployment status alerts.">
        <div className="space-y-2">
          <SettingsSwitch
            label="Payment Received / Milestone Added"
            description="Notify when a client payment milestone or deliverable invoice is created."
            checked={notifications.events.paymentAdded}
            onChange={(checked) => handleEventToggle('paymentAdded', checked)}
          />
          <SettingsSwitch
            label="Payment Verified & Signed-Off"
            description="Notify when a milestone deliverable is approved or verified."
            checked={notifications.events.paymentVerified}
            onChange={(checked) => handleEventToggle('paymentVerified', checked)}
          />
          <SettingsSwitch
            label="Production Deployment Succeeded"
            description="Notify when a production release build completes."
            checked={notifications.events.deploymentSuccess}
            onChange={(checked) => handleEventToggle('deploymentSuccess', checked)}
          />
          <SettingsSwitch
            label="Deployment Failure / Health Alert"
            description="Notify when an environment health check fails or deployment errors occur."
            checked={notifications.events.deploymentFailed}
            onChange={(checked) => handleEventToggle('deploymentFailed', checked)}
          />
          <SettingsSwitch
            label="Share Link Created & Expiry Alert"
            description="Notify when a client share portal link is created or expires."
            checked={notifications.events.shareLinkCreated}
            onChange={(checked) => handleEventToggle('shareLinkCreated', checked)}
          />
          <SettingsSwitch
            label="System Security & Backup Warnings"
            description="Notify on automatic backup status, storage usage, and authentication alerts."
            checked={notifications.events.systemWarning}
            onChange={(checked) => handleEventToggle('systemWarning', checked)}
          />
        </div>
      </SettingsCard>
    </div>
  );
};
