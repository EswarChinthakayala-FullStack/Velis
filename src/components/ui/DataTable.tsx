import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyText?: string;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyText = 'No items found',
  className = '',
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className={`overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,19,0.5)] backdrop-blur-xl ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)] bg-zinc-900/60 sticky top-0 backdrop-blur-md z-10">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40 text-sm text-[#D4D4D8]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-zinc-500 italic"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors duration-150 group hover:bg-zinc-800/40 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`px-5 py-4 ${col.className || ''}`}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
