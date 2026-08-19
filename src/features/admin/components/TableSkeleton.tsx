"use client";

interface Props {
  columns: string[];
  rows?: number;
}

export default function TableSkeleton({ columns, rows = 10 }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-3.5 text-right text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr
                key={i}
                className="border-t border-ink/10 odd:bg-white even:bg-mist/30"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3">
                    <div
                      className="h-4 animate-pulse rounded bg-ink/10"
                      style={{ maxWidth: `${(col.length % 5) * 15 + 45}%` }}
                    />
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="ml-auto h-8 w-24 animate-pulse rounded-lg bg-ink/10" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
