import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

declare module "axios" {
  export interface AxiosRequestConfig {
    admin?: boolean;
    _retried?: boolean;
  }
}

const http = axios.create({
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<boolean> | null = null;
function refreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
}

http.interceptors.request.use((config) => {
  config.headers.set("x-request-mode", config.admin ? "admin" : "public");
  return config;
});

http.interceptors.response.use(
  async (res) => {
    const cfg = res.config;
    if (cfg.admin && !cfg._retried && res.headers["x-auth-mode"] === "public") {
      cfg._retried = true;
      if (await refreshOnce()) return http.request(cfg);
      redirectToLogin();
    }
    return res;
  },
  async (err) => {
    const cfg = err.config;
    if (cfg?.admin && !cfg._retried && err.response?.status === 401) {
      cfg._retried = true;
      if (await refreshOnce()) return http.request(cfg);
      redirectToLogin();
    }
    const message =
      err.response?.data?.error ||
      err.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  },
);

export interface PagedResult<T> {
  docs: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type UserRole = "superadmin" | "admin" | "editor";

export interface UserDoc {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface AuditDoc {
  id: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  table: string;
  recordId?: string;
  summary: string;
  changes?: Record<string, unknown>;
  createdAt: string;
}

export const api = {
  list: <T>(table: string) =>
    http.get<T[]>(`/api/${table}`).then((r) => r.data),
  listAdmin: <T>(table: string) =>
    http.get<T[]>(`/api/${table}`, { admin: true }).then((r) => r.data),
  eventRoster: (eventId: string) =>
    http
      .get<
        {
          fullName: string;
          className: string;
          institution: string;
          registered: boolean;
          participated: boolean;
        }[]
      >("/api/event-roster", { params: { eventId } })
      .then((r) => r.data),
  paged: <T>(
    table: string,
    params: {
      page: number;
      pageSize: number;
      search?: string;
      filterField?: string;
      filterValue?: string;
      filters?: { field: string; value: string | string[] }[];
      sortLast?: { field: string; values: string[] };
      public?: boolean;
    },
  ) => {
    const { public: isPublic, ...query } = params;
    return http
      .get<PagedResult<T>>(`/api/${table}`, {
        admin: !isPublic,
        params: {
          page: query.page,
          pageSize: query.pageSize,
          search: query.search,
          filterField: query.filterField,
          filterValue: query.filterValue,
          filters:
            query.filters && query.filters.length > 0
              ? JSON.stringify(query.filters)
              : undefined,
          sortLast: query.sortLast
            ? JSON.stringify(query.sortLast)
            : undefined,
        },
      })
      .then((r) => r.data);
  },
  get: <T>(table: string, id: string) =>
    http.get<T>(`/api/${table}/${id}`, { admin: true }).then((r) => r.data),
  create: <T>(table: string, data: unknown) =>
    http.post<T>(`/api/${table}`, data, { admin: true }).then((r) => r.data),
  update: <T>(table: string, id: string, data: unknown) =>
    http
      .put<T>(`/api/${table}/${id}`, data, { admin: true })
      .then((r) => r.data),
  remove: (table: string, id: string) =>
    http
      .delete<{ ok: boolean }>(`/api/${table}/${id}`, { admin: true })
      .then((r) => r.data),
  checkCertificate: (phone: string, quizTitle: string) =>
    http
      .get<{ taken: boolean }>("/api/certificates", { params: { phone, quizTitle } })
      .then((r) => r.data),
  deletedList: <T extends Record<string, unknown>>(table?: string) =>
    http
      .get<{ docs: T[]; total: number }>("/api/deleted", {
        admin: true,
        params: table ? { table } : {},
      })
      .then((r) => r.data),
  restoreDeleted: (table: string, id: string) =>
    http
      .post<{ ok: boolean }>("/api/deleted", { table, id }, { admin: true })
      .then((r) => r.data),
  permanentlyDelete: (table: string, id: string) =>
    http
      .delete<{ ok: boolean }>("/api/deleted", {
        admin: true,
        data: { table, id },
      })
      .then((r) => r.data),
  authMe: () =>
    http
      .get<{ username: string; role: UserRole }>("/api/auth/me", {
        admin: true,
      })
      .then((r) => r.data),
  logout: () => http.post("/api/auth/logout").then((r) => r.data),
  listUsers: () =>
    http.get<UserDoc[]>("/api/users", { admin: true }).then((r) => r.data),
  createUser: (data: { username: string; password: string; role: UserRole }) =>
    http.post<UserDoc>("/api/users", data, { admin: true }).then((r) => r.data),
  updateUser: (
    id: string,
    data: { username?: string; password?: string; role?: UserRole },
  ) =>
    http
      .put<UserDoc>(`/api/users/${id}`, data, { admin: true })
      .then((r) => r.data),
  deleteUser: (id: string) =>
    http
      .delete<{ ok: boolean }>(`/api/users/${id}`, { admin: true })
      .then((r) => r.data),
  audit: (params: {
    page?: number;
    pageSize?: number;
    table?: string;
    action?: string;
    actor?: string;
    search?: string;
  }) =>
    http
      .get<PagedResult<AuditDoc>>("/api/audit", {
        admin: true,
        params: {
          page: params.page,
          pageSize: params.pageSize,
          table: params.table,
          action: params.action,
          actor: params.actor,
          search: params.search,
        },
      })
      .then((r) => r.data),
};

export function useTable<T>(
  table: string,
  fallback: T[],
): [T[], boolean] {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  const fallbackRef = useRef(fallback);
  useEffect(() => {
    let cancelled = false;
    api
      .list<T>(table)
      .then((result) => {
        if (!cancelled) setData(result.length > 0 ? result : fallbackRef.current);
      })
      .catch(() => {
        if (!cancelled) setData(fallbackRef.current);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [table]);

  return [data, loading];
}

export function useTableQuery<T>(table: string) {
  return useQuery({
    queryKey: ["table", table],
    queryFn: () => api.list<T>(table),
  });
}

export function useMergedStaticTable<T extends { id: unknown }>(
  table: string,
  staticData: T[],
): [T[], boolean] {
  const [fetched, setFetched] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .list<T>(table)
      .then((result) => {
        if (!cancelled) setFetched(result);
      })
      .catch(() => {
        if (!cancelled) setFetched([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [table]);

  const merged = useMemo(() => {
    const map = new Map<string, T>();
    for (const item of staticData) map.set(String(item.id), item);
    for (const item of fetched) {
      const id = (item as { id?: unknown }).id;
      const key =
        id !== undefined && id !== null
          ? String(id)
          : String((item as { name?: unknown }).name ?? "");
      if (key) map.set(key, item);
    }
    return Array.from(map.values());
  }, [fetched, staticData]);

  return [merged, loading];
}

export function useCreateDoc(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.create(table, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["table", table] }),
  });
}

export function useUpdateDoc(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.update(table, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["table", table] }),
  });
}

export function useDeleteDoc(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.remove(table, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["table", table] }),
  });
}

export function useAuthMe() {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => api.authMe(),
  });
}
