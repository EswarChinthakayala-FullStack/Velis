import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon, ViewIcon, PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { useDeleteClient } from '../hooks/useDeleteClient';
import type { ClientRecord } from '../../../types/client';
import { ClientFormDrawer } from '../client-form-drawer';
import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';

interface ClientActionsMenuProps {
  client: ClientRecord;
}

export const ClientActionsMenu: React.FC<ClientActionsMenuProps> = ({ client }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; right: number }>({ right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const deleteMutation = useDeleteClient();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const right = Math.max(12, window.innerWidth - rect.right);
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < 150) {
        setCoords({ bottom: window.innerHeight - rect.top + 6, right });
      } else {
        setCoords({ top: rect.bottom + 6, right });
      }
    }
    setIsOpen(!isOpen);
  };

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync(client.id);
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0 select-none">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        title="Client Actions"
        aria-label="Client Actions"
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* Transparent backdrop overlay */}
            <div
              className="fixed inset-0 z-[9998] cursor-default"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            {/* Portal Menu positioned fixed relative to viewport */}
            <div
              className="fixed w-44 rounded-xl bg-[#121215] border border-zinc-800 p-1.5 shadow-2xl z-[9999] text-xs animate-in fade-in-0 zoom-in-95 select-none"
              style={{
                top: coords.top !== undefined ? `${coords.top}px` : undefined,
                bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
                right: `${coords.right}px`,
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  navigate(`/app/clients/${client.id}`);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer font-medium"
              >
                <HugeiconsIcon icon={ViewIcon} size={14} className="text-zinc-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsEditOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer font-medium"
              >
                <HugeiconsIcon icon={PencilEdit01Icon} size={14} className="text-zinc-400" />
                <span>Edit Client</span>
              </button>

              <div className="my-1 border-t border-zinc-800/60" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsConfirmDeleteOpen(true);
                }}
                disabled={deleteMutation.isPending}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer font-medium disabled:opacity-50"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
                <span>{deleteMutation.isPending ? 'Deleting...' : 'Delete Client'}</span>
              </button>
            </div>
          </>,
          document.body
        )}

      {/* Edit Drawer Trigger */}
      <ClientFormDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="edit"
        client={client}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client Profile"
        description={`Are you sure you want to delete client "${client.name}"? This action cannot be undone.`}
        confirmText="Delete Client"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ClientActionsMenu;
