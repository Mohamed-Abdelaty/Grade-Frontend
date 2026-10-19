import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
}

export function Table<T>({ columns, rows, rowKey }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm font-sans">
        {/* رأس الجدول Header */}
        <thead className="border-b border-slate-200/80 bg-slate-50/80 uppercase text-[11px] font-extrabold tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* جسم الجدول Body */}
        <tbody className="divide-y divide-slate-100 bg-white text-slate-900 dark:divide-slate-800/60 dark:bg-slate-900 dark:text-slate-100">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="transition-colors duration-150 hover:bg-teal-50/40 dark:hover:bg-slate-800/50"
            >
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`px-5 py-4 text-xs font-semibold text-slate-900 dark:text-slate-100 ${
                    col.className || ''
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}