import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ClientActionsMenu } from './ClientActionsMenu';
import type { ClientRecord } from '../../../types/client';

interface ClientsTableProps {
  data: ClientRecord[];
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Format relative timestamp safely using date-fns
  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  // Helper for generating initials avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const columns = useMemo<ColumnDef<ClientRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Client',
        cell: ({ row }) => {
          const client = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-bold text-white shrink-0 uppercase tracking-wider">
                {getInitials(client.name)}
              </div>
              <div className="min-w-0">
                <button
                  onClick={() => navigate(`/app/clients/${client.id}`)}
                  className="font-semibold text-white hover:underline truncate block text-left text-xs cursor-pointer"
                >
                  {client.name}
                </button>
                {client.email && (
                  <span className="text-[11px] text-zinc-400 font-mono block truncate">
                    {client.email}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => (
          <span className="text-xs text-zinc-300 font-medium">
            {row.original.company || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ row }) => (
          <span className="text-xs text-zinc-400 font-mono">
            {row.original.country || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'activeProjectsCount',
        header: 'Active Projects',
        cell: ({ row }) => (
          <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-zinc-800 text-white border border-zinc-700/80">
            {row.original.activeProjectsCount} Projects
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.original.status === 'active';
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full border ${
                isActive
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              <span>{isActive ? 'Active' : 'Inactive'}</span>
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-[11px] font-mono text-zinc-400">
            {formatTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => <ClientActionsMenu client={row.original} />,
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800/80 bg-[rgba(17,17,19,0.85)] backdrop-blur-2xl shadow-xl select-none">
      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-400 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-zinc-800/60 text-xs">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onDoubleClick={() => navigate(`/app/clients/${row.original.id}`)}
              className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;
