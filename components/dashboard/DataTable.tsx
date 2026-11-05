"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Column<T> { header: string; cell: (row: T) => ReactNode; className?: string }

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  filter?: { label: string; options: string[]; value: (row: T) => string };
  pageSize?: number;
  empty?: string;
}

export default function DataTable<T>({ rows, columns, searchText, filter, pageSize = 8, empty = "Nothing to show yet." }: Props<T>) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => rows.filter((r) => (f === "ALL" || filter?.value(r) === f) && searchText(r).toLowerCase().includes(q.toLowerCase())),
    [rows, q, f, filter, searchText]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { setPage(1); }, [q, f]);
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="h-10 pl-9" />
        </div>
        {filter && (
          <select value={f} onChange={(e) => setF(e.target.value)} aria-label={filter.label}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
            <option value="ALL">All {filter.label.toLowerCase()}</option>
            {filter.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
      </div>

      {slice.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                {columns.map((c) => <th key={c.header} className={`pb-3 font-medium ${c.className ?? ""}`}>{c.header}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {slice.map((row, i) => (
                <tr key={i}>{columns.map((c) => <td key={c.header} className={`py-3 ${c.className ?? ""}`}>{c.cell(row)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">Page {page} of {pages} · {filtered.length} results</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /> Prev</Button>
            <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}