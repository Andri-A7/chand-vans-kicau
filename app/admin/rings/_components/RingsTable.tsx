"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Loader2, CircleDot } from "lucide-react";
import { deleteRingAction } from "../../../../actions/ring.actions";

export type RingRow = {
  id: string;
  code: string;
  isAssigned: boolean;
  createdAt: string;
  birdTitle: string | null;
};

type StatusFilter = "all" | "available" | "assigned";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ isAssigned }: { isAssigned: boolean }) {
  return isAssigned ? (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      Terpakai
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      Tersedia
    </span>
  );
}

function DeleteButton({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={() => {
        if (!confirm("Hapus ring ini? Tindakan ini tidak dapat dibatalkan.")) return;
        startTransition(async () => {
          await deleteRingAction(id);
        });
      }}
      aria-label="Hapus ring"
      title={disabled ? "Ring terpakai tidak dapat dihapus" : "Hapus"}
      className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-500"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

export default function RingsTable({ rings }: { rings: RingRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return rings.filter((ring) => {
      const matchesQuery = ring.code
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesStatus =
        status === "all" ||
        (status === "available" && !ring.isAssigned) ||
        (status === "assigned" && ring.isAssigned);
      return matchesQuery && matchesStatus;
    });
  }, [rings, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nomor ring..."
            aria-label="Cari nomor ring"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          aria-label="Filter status"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-48"
        >
          <option value="all">Semua Status</option>
          <option value="available">Tersedia</option>
          <option value="assigned">Terpakai</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nomor Ring
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tanggal Dibuat
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <CircleDot
                      className="mx-auto mb-3 h-8 w-8 text-slate-300"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-slate-500">
                      Tidak ada ring yang cocok dengan pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((ring) => (
                  <tr
                    key={ring.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-slate-900">
                        {ring.code}
                      </span>
                      {ring.birdTitle && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {ring.birdTitle}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge isAssigned={ring.isAssigned} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(ring.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/rings/${ring.id}/edit`}
                          aria-label="Edit ring"
                          title="Edit"
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <DeleteButton id={ring.id} disabled={ring.isAssigned} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
