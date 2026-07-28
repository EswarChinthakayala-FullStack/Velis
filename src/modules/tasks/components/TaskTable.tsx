import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type RowSelectionState,
} from '@tanstack/react-table';
import type { TaskItem, TaskPriority, TaskStatus } from '../lib/types/task';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskProgressSlider } from './TaskProgressSlider';
import { DatePicker } from '../../../components/ui/date-picker';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../../components/ui/dropdown-menu';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Edit01Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  MoreHorizontalIcon,
} from '@hugeicons/core-free-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface TaskTableProps {
  tasks: TaskItem[];
  selectedTaskIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onUpdateDueDate: (id: string, dueDate: string) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
}

const columnHelper = createColumnHelper<TaskItem>();

function formatRelativeDate(isoString?: string): string {
  if (!isoString) return 'recently';
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return 'recently';
  }
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  selectedTaskIds,
  onSelectionChange,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateProgress,
  onUpdateDueDate,
  onEditTask,
  onDeleteTask,
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Sync TanStack row selection state with parent selection IDs
  const handleRowSelection = (updaterOrValue: any) => {
    const nextSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
    setRowSelection(nextSelection);

    const selectedIds = Object.keys(nextSelection)
      .filter((index) => nextSelection[index])
      .map((index) => tasks[Number(index)]?.id)
      .filter(Boolean);

    onSelectionChange(selectedIds);
  };

  const columns = [
    // 1. Selection Checkbox Column
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded-sm border-zinc-700 bg-zinc-900 accent-white cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded-sm border-zinc-700 bg-zinc-900 accent-white cursor-pointer"
        />
      ),
    }),

    // 2. Task Title & Module
    columnHelper.accessor('title', {
      header: 'Task Deliverable',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="space-y-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <span
                onClick={() => onEditTask(item)}
                className="font-bold text-white hover:text-rose-400 transition-colors cursor-pointer line-clamp-1"
              >
                {item.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="truncate max-w-[140px] font-semibold text-zinc-400">
                {item.projectName || 'Unassigned'}
              </span>
              {item.module && (
                <span className="px-1.5 py-0.2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {item.module}
                </span>
              )}
            </div>
          </div>
        );
      },
    }),

    // 3. Execution Status
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <TaskStatusBadge
          status={row.original.status}
          onChangeStatus={(status) => onUpdateStatus(row.original.id, status)}
        />
      ),
    }),

    // 4. Priority Level
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: ({ row }) => (
        <TaskPriorityBadge
          priority={row.original.priority}
          onChangePriority={(priority) => onUpdatePriority(row.original.id, priority)}
        />
      ),
    }),

    // 5. Progress Slider
    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: ({ row }) => (
        <div className="min-w-[130px]">
          <TaskProgressSlider
            progress={row.original.progress}
            onChangeProgress={(progress) => onUpdateProgress(row.original.id, progress)}
          />
        </div>
      ),
    }),

    // 6. Due Date Picker
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: ({ row }) => (
        <div className="min-w-[110px]">
          <DatePicker
            value={row.original.dueDate || ''}
            onChange={(val: any) => onUpdateDueDate(row.original.id, String(val))}
            className="w-full h-7 bg-zinc-900 border-zinc-800 text-[11px] rounded-sm"
          />
        </div>
      ),
    }),

    // 7. Labels
    columnHelper.accessor('labels', {
      header: 'Labels',
      cell: ({ row }) => {
        const labels = row.original.labels;
        if (!labels || labels.length === 0) {
          return <span className="text-zinc-600 text-[10px] italic">No labels</span>;
        }
        return (
          <div className="flex items-center gap-1 flex-wrap max-w-[150px]">
            {labels.slice(0, 2).map((l) => (
              <span
                key={l}
                className="px-1.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
              >
                #{l}
              </span>
            ))}
            {labels.length > 2 && (
              <span className="text-[10px] text-zinc-500 font-mono">+{labels.length - 2}</span>
            )}
          </div>
        );
      },
    }),

    // 8. Created Relative Time
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-[11px] font-mono text-zinc-500">
          {formatRelativeDate(row.original.createdAt)}
        </span>
      ),
    }),

    // 9. Row Actions Menu (Portal Enabled via DropdownMenu)
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors outline-none cursor-pointer">
                <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="min-w-36">
                <DropdownMenuItem
                  onClick={() => onEditTask(item)}
                  className="font-mono text-xs text-zinc-200 cursor-pointer flex items-center gap-2"
                >
                  <HugeiconsIcon icon={Edit01Icon} size={13} />
                  <span>Edit Task</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onUpdateStatus(item.id, 'completed')}
                  className="font-mono text-xs text-emerald-400 cursor-pointer flex items-center gap-2"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                  <span>Complete</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onDeleteTask(item.id)}
                  className="font-mono text-xs text-rose-400 cursor-pointer flex items-center gap-2"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={13} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: handleRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className="space-y-3 font-mono select-none">
      {/* Table Container */}
      <div className="rounded-sm bg-[#0c0c0e]/90 border border-zinc-800/90 shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-zinc-800/80 bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3 font-mono">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-zinc-800/50">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-zinc-900/50 transition-colors ${
                    row.getIsSelected() ? 'bg-zinc-900/80' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 align-middle text-zinc-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-zinc-400 font-mono">
          <div>
            Page <span className="font-bold text-white">{table.getState().pagination.pageIndex + 1}</span> of{' '}
            <span className="font-bold text-white">{table.getPageCount()}</span> ({tasks.length} total tasks)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
