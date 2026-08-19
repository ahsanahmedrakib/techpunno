"use client";

import {
  api,
  useAuthMe,
  type UserDoc,
  type UserRole,
} from "@/lib/api";
import { formatDateAndTime } from "@/lib/utils";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Inbox,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";
import TableSkeleton from "./TableSkeleton";

const CREATABLE_ROLES: UserRole[] = ["admin", "editor"];

const roleBadge = (role: UserRole) => {
  if (role === "superadmin")
    return "bg-amber-100 text-amber-800 border-2 border-amber-400";
  if (role === "admin")
    return "bg-primary-lighter text-primary border-2 border-primary/40";
  return "bg-slate-100 text-slate-600 border border-slate-300";
};

interface FormState {
  username: string;
  password: string;
  role: UserRole;
}

export default function UsersManager() {
  const qc = useQueryClient();
  const { data: me } = useAuthMe();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<UserDoc | null>(null);
  const [deleting, setDeleting] = useState<UserDoc | null>(null);
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    role: "editor",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery<UserDoc[]>({
    queryKey: ["users"],
    queryFn: () => api.listUsers(),
    placeholderData: keepPreviousData,
  });

  const users = data ?? [];
  const isEditingSuperAdmin = view === "edit" && editing?.role === "superadmin";

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["users"] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: { username: string; password: string; role: UserRole }) =>
      api.createUser(payload),
    onSuccess: () => {
      toast.success("User created");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Create failed"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: {
      id: string;
      username?: string;
      password?: string;
      role?: UserRole;
    }) => api.updateUser(payload.id, payload),
    onSuccess: () => {
      toast.success("User updated");
      invalidate();
      qc.invalidateQueries({ queryKey: ["auth-me"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Delete failed"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (view === "create" && !form.password) {
      toast.error("Password is required");
      return;
    }
    setSubmitting(true);
    try {
      if (view === "create") {
        await createMutation.mutateAsync({
          username: form.username.trim(),
          password: form.password,
          role: form.role,
        });
      } else if (editing) {
        const payload: {
          id: string;
          username?: string;
          password?: string;
          role?: UserRole;
        } = { id: editing.id };
        if (editing.role === "superadmin") {
          if (!form.password) {
            toast.error("Enter a new password for the superadmin");
            return;
          }
          payload.password = form.password;
        } else {
          payload.username = form.username.trim();
          payload.role = form.role;
          if (form.password) payload.password = form.password;
        }
        await updateMutation.mutateAsync(payload);
      }
      setView("list");
      setEditing(null);
    } catch {
      /* toast handled by mutation */
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
    } catch {
      /* toast handled by mutation */
    }
    setDeleting(null);
  };

  const baseInput =
    "w-full rounded-xl border bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 hover:border-primary-dark";

  return (
    <div className="space-y-5">
      {(view === "create" || view === "edit") && (
        <div className="overflow-hidden rounded-lg border-2 border-primary/50 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-linear-to-r from-[#1a3a68] to-primary px-5 py-3.5">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {view === "create" ? "New User" : `Edit ${editing?.username}`}
            </h3>
          </div>
          <div className="p-6">
            {isEditingSuperAdmin && (
              <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                The superadmin cannot be renamed, re-rolled or deleted. Only the
                password can be changed.
              </p>
            )}
            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
              {!isEditingSuperAdmin && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    Username <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, username: e.target.value }))
                    }
                    placeholder="e.g. johndoe"
                    className={baseInput}
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  Password
                  {view === "create" && (
                    <span className="text-secondary"> *</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    placeholder={
                      view === "edit"
                        ? "Leave blank to keep unchanged"
                        : "New password"
                    }
                    className={`${baseInput} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    title={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-3 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink-soft transition-colors hover:bg-mist hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {view === "edit" && (
                  <p className="mt-1 text-[11px] text-ink-soft/60">
                    Leave blank to keep the current password.
                  </p>
                )}
              </div>

              {!isEditingSuperAdmin && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    Role <span className="text-secondary">*</span>
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        role: e.target.value as UserRole,
                      }))
                    }
                    className={`${baseInput} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%230c9b5d%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")] bg-size-[10px] bg-position-[right_12px_center] bg-no-repeat pr-10`}
                  >
                    <option value="">Select...</option>
                    {CREATABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-ink-soft/60">
                    Only one superadmin exists and cannot be created or assigned.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 border-t-2 border-primary/20 pt-5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : view === "create"
                      ? "Create User"
                      : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView("list");
                    setEditing(null);
                  }}
                  className="cursor-pointer rounded-xl border-2 border-primary/30 px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-mist hover:border-primary/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === "list" && (
        <>
          <div className="flex flex-col gap-3 rounded-lg border-2 border-primary/30 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">User Accounts</h3>
              <p className="mt-0.5 text-xs text-ink-soft">
                Admins can add users, update passwords and delete users. Editors
                cannot delete content.
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                title="Refresh"
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg border-2 border-primary/30 bg-white px-3 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={() => {
                  setForm({ username: "", password: "", role: "editor" });
                  setEditing(null);
                  setShowPassword(false);
                  setView("create");
                }}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                New User
              </button>
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton
              columns={[
                "Username",
                "Role",
                "Last Login",
                "Created",
                "Updated",
                "Actions",
              ]}
              rows={5}
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
                      <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                        Username
                      </th>
                      <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                        Role
                      </th>
                      <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                        Last Login
                      </th>
                      <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                        Created
                      </th>
                      <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                        Updated
                      </th>
                      <th className="px-4 py-3.5 text-right text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-16 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink-soft/30">
                            <Inbox className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium text-ink-soft">
                            No users found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => {
                        const isSelf = user.username === me?.username;
                        const isSuper = user.role === "superadmin";
                        return (
                          <tr
                            key={user.id}
                            className="border-t border-ink/10 transition-colors odd:bg-white even:bg-mist/30 hover:bg-primary-lighter/40"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-lighter text-primary">
                                  {isSuper ? (
                                    <ShieldCheck className="h-4 w-4" />
                                  ) : (
                                    <UserIcon className="h-4 w-4" />
                                  )}
                                </span>
                                <div>
                                  <span className="font-semibold text-ink">
                                    {user.username}
                                  </span>
                                  {isSelf && (
                                    <span className="ml-2 rounded-full bg-primary-lighter px-2 py-0.5 text-[10px] font-bold text-primary">
                                      YOU
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleBadge(user.role)}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium whitespace-nowrap text-ink-soft">
                              {user.lastLoginAt
                                ? formatDateAndTime(user.lastLoginAt)
                                : "Never"}
                            </td>
                            <td className="px-4 py-3 font-medium whitespace-nowrap text-ink-soft">
                              {formatDateAndTime(user.createdAt)}
                            </td>
                            <td className="px-4 py-3 font-medium whitespace-nowrap text-ink-soft">
                              {formatDateAndTime(user.updatedAt)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditing(user);
                                    setForm({
                                      username: user.username,
                                      password: "",
                                      role: user.role,
                                    });
                                    setShowPassword(false);
                                    setView("edit");
                                  }}
                                  title={
                                    isSuper
                                      ? "Update password"
                                      : "Edit user"
                                  }
                                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-primary/30 bg-white text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                                >
                                  {isSuper ? (
                                    <Lock className="h-4 w-4" />
                                  ) : (
                                    <Pencil className="h-4 w-4" />
                                  )}
                                </button>
                                {!isSuper && !isSelf && (
                                  <button
                                    onClick={() => setDeleting(user)}
                                    title="Delete user"
                                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-secondary/30 bg-white text-secondary transition-all hover:border-secondary/50 hover:bg-secondary-light"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleting}
        title={`Delete user ${deleting?.username ? `"${deleting.username}"` : ""}?`}
        message="This user will be permanently removed and can no longer sign in."
        confirmLabel="Delete User"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}