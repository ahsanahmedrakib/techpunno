"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatDateAndTime } from "@/lib/utils";

export interface PublicUserRow {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
}

export default function PublicUsersManager() {
  const { data, isLoading, refetch } = useQuery<PublicUserRow[]>({
    queryKey: ["public-users"],
    queryFn: () =>
      api.publicUserList().catch(() => []) as Promise<PublicUserRow[]>,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/public-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error || "Delete failed");
      }
      toast.success("User deleted");
      void refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
    setDeletingId(null);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
              <th className="px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-white/85">
                Name
              </th>
              <th className="px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-white/85">
                Mobile
              </th>
              <th className="px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-white/85">
                Email
              </th>
              <th className="px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-white/85">
                Registered
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-bold tracking-wider uppercase text-white/85">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-ink-soft">
                  Loading…
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink-soft/30">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-ink-soft">No public users yet</p>
                </td>
              </tr>
            ) : (
              data.map((u) => (
                <tr key={u.id} className="border-t border-ink/10 odd:bg-white even:bg-mist/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-lighter text-primary">
                        <Users className="h-4 w-4" />
                      </span>
                      <span className="font-medium text-ink">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink">{u.mobile}</td>
                  <td className="px-4 py-3 text-ink">{u.email || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {formatDateAndTime(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeletingId(u.id)}
                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-secondary/30 bg-white text-secondary transition-all hover:border-secondary/50 hover:bg-secondary-light"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDeletingId(null)}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-ink">Delete this account?</h3>
            <p className="mt-2 text-sm text-ink-soft">
              This will revoke the user&apos;s account. They will no longer be able
              to sign in or access paid books with this account.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="cursor-pointer rounded-xl border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-mist"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="cursor-pointer rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/80"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
