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
import type { ClientProject } from '../../../types/client';
import { ProjectStatusBadge } from '../../projects/components/ProjectStatusBadge';
import { ProjectPriorityBadge } from '../../projects/components/ProjectPriorityBadge';

interface ClientProjectsTableProps {
  projects: ClientProject[];
  isLoading?: boolean;
}

export const ClientProjectsTable: React.FC<ClientProjectsTableProps> = ({ projects, isLoading }) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const columns = useMemo<ColumnDef<ClientProject>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Project Name',
        cell: ({ row }) => {
          const proj = row.original;
          return (
            <div className="flex items-center gap-2.5 min-w-[140px]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: proj.color || '#FAFAFA' }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/app/projects/${proj.id}`);
                }}
                className="font-bold text-white hover:underline text-xs truncate cursor-pointer text-left"
              >
                {proj.name}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <ProjectStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'completionPercent',
        header: 'Progress',
        cell: ({ row }) => {
          const pct = row.original.completionPercent;
          return (
            <div className="flex items-center gap-2.5 w-32 shrink-0">
              <div className="flex-1 h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-zinc-300 shrink-0">
                {pct}%
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => <ProjectPriorityBadge priority={row.original.priority} />,
      },
      {
        accessorKey: 'deadline',
        header: 'Deadline',
        cell: ({ row }) => (
          <span className="text-[11px] font-mono text-zinc-400 whitespace-nowrap">
            {row.original.deadline || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: ({ row }) => (
          <span className="text-[11px] font-mono text-zinc-400 whitespace-nowrap">
            {formatTime(row.original.updatedAt)}
          </span>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: projects,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse select-none">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-zinc-900/40 rounded-lg border border-zinc-800/40" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-8 text-center border border-zinc-800/80 rounded-lg bg-[rgba(17,17,19,0.85)] space-y-2 select-none">
        <p className="text-xs font-bold text-white">No projects yet</p>
        <p className="text-[11px] text-zinc-500 font-mono">
          Create the first project for this client to start tracking deliverables and progress.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto custom-scrollbar rounded-lg border border-zinc-800/80 bg-[rgba(17,17,19,0.85)] backdrop-blur-2xl shadow-xl select-none">
      <table className="w-full min-w-[750px] text-left border-collapse">
        <thead className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-400 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-semibold whitespace-nowrap">
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
              onClick={() => navigate(`/app/projects/${row.original.id}`)}
              className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 align-middle whitespace-nowrap">
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

export default ClientProjectsTable;
