import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Money01Icon,
  Share01Icon,
  Mail01Icon,
  StarIcon,
  Add01Icon,
  CallIcon,
  Building01Icon,
  Cancel01Icon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import { DataTable, type Column } from '../ui/DataTable';
import type { ClientPortal, Invoice } from '../../types';

interface ClientPortalViewProps {
  clients: ClientPortal[];
  invoices: Invoice[];
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  clients: initialClients,
  invoices
}) => {
  const [clientsList, setClientsList] = useState<ClientPortal[]>(initialClients);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    clientName: '',
    company: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.clientName || !newClient.email) return;

    const createdClient: ClientPortal = {
      id: `client-${Date.now()}`,
      clientName: newClient.clientName,
      company: newClient.company || 'Independent',
      activeProjectsCount: 0,
      unpaidInvoicesTotal: 0,
      satisfactionRating: 5.0,
      lastActive: 'Just added',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      email: newClient.email
    };

    setClientsList([createdClient, ...clientsList]);
    setNewClient({ clientName: '', company: '', email: '', phone: '', notes: '' });
    setIsAddClientOpen(false);
  };

  const invoiceColumns: Column<Invoice>[] = [
    {
      header: 'Invoice ID',
      cell: (inv) => <span className="font-mono text-white font-semibold">#{inv.id}</span>
    },
    {
      header: 'Client & Project',
      cell: (inv) => (
        <div>
          <div className="font-semibold text-white">{inv.clientName}</div>
          <div className="text-xs text-zinc-400">{inv.projectName}</div>
        </div>
      )
    },
    {
      header: 'Amount',
      cell: (inv) => (
        <span className="font-mono font-semibold text-white">
          ${inv.amount.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (inv) => (
        <GlassBadge
          variant={
            inv.status === 'paid'
              ? 'solid'
              : inv.status === 'overdue'
              ? 'outline'
              : 'zinc'
          }
          size="sm"
        >
          {inv.status}
        </GlassBadge>
      )
    },
    {
      header: 'Due Date',
      cell: (inv) => <span className="font-mono text-xs text-zinc-400">{inv.dueDate}</span>
    },
    {
      header: 'Actions',
      cell: () => (
        <GlassButton variant="secondary" size="sm">
          Send Reminder
        </GlassButton>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Client Collaboration Portals
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Manage client records, shareable portal links, and deliverable sign-offs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GlassButton variant="primary" onClick={() => setIsAddClientOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" /> Add Client Data
          </GlassButton>
          <GlassButton variant="secondary">
            <HugeiconsIcon icon={Share01Icon} size={16} className="mr-2" /> Share Portal Link
          </GlassButton>
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[rgba(17,17,19,0.95)] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HugeiconsIcon icon={Building01Icon} size={18} className="text-rose-500" />
                Add New Client Record
              </h2>
              <button
                onClick={() => setIsAddClientOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <form onSubmit={handleAddClientSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={newClient.clientName}
                  onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Cyberdyne Inc"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@cyberdyne.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Client Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes on client requirements, preferences, or SLAs..."
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <GlassButton variant="secondary" onClick={() => setIsAddClientOpen(false)}>
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" type="submit">
                  Save Client Record
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {clientsList.map((c) => (
          <GlassCard key={c.id} hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={c.avatarUrl}
                  alt={c.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{c.clientName}</h3>
                  <p className="text-xs text-zinc-400">{c.company}</p>
                </div>
              </div>
              <GlassBadge variant="zinc" size="sm">
                <HugeiconsIcon icon={StarIcon} size={12} className="text-zinc-300 mr-1" />
                {c.satisfactionRating}
              </GlassBadge>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Active Projects:</span>
                <span className="text-white">{c.activeProjectsCount}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Unpaid Balance:</span>
                <span className="text-white font-semibold">
                  ${(c.unpaidInvoicesTotal ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Last Active:</span>
                <span className="text-zinc-500">{c.lastActive}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                <HugeiconsIcon icon={Mail01Icon} size={12} /> {c.email}
              </span>
              <GlassButton variant="ghost" size="sm">
                Portal View
              </GlassButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Invoices Management Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Client Invoices & Deliverable Sign-Offs
          </h2>
          <GlassButton variant="secondary" size="sm">
            <HugeiconsIcon icon={Money01Icon} size={16} className="mr-1.5" /> Create Invoice
          </GlassButton>
        </div>

        <DataTable
          data={invoices}
          columns={invoiceColumns}
          keyExtractor={(inv) => inv.id}
        />
      </div>
    </div>
  );
};
