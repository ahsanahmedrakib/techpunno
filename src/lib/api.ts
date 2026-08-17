import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const http = axios.create({
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
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

export const api = {
  list: <T>(table: string) =>
    http.get<T[]>(`/api/${table}`).then((r) => r.data),
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
    },
  ) =>
    http
      .get<PagedResult<T>>(`/api/${table}`, {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          search: params.search,
          filterField: params.filterField,
          filterValue: params.filterValue,
          filters:
            params.filters && params.filters.length > 0
              ? JSON.stringify(params.filters)
              : undefined,
          sortLast: params.sortLast
            ? JSON.stringify(params.sortLast)
            : undefined,
        },
      })
      .then((r) => r.data),
  get: <T>(table: string, id: string) =>
    http.get<T>(`/api/${table}/${id}`).then((r) => r.data),
  create: <T>(table: string, data: unknown) =>
    http.post<T>(`/api/${table}`, data).then((r) => r.data),
  update: <T>(table: string, id: string, data: unknown) =>
    http.put<T>(`/api/${table}/${id}`, data).then((r) => r.data),
  remove: (table: string, id: string) =>
    http.delete<{ ok: boolean }>(`/api/${table}/${id}`).then((r) => r.data),
  checkCertificate: (phone: string, quizTitle: string) =>
    http
      .get<{ taken: boolean }>("/api/certificates", { params: { phone, quizTitle } })
      .then((r) => r.data),
  deletedList: <T extends Record<string, unknown>>(table?: string) =>
    http
      .get<{ docs: T[]; total: number }>("/api/deleted", {
        params: table ? { table } : {},
      })
      .then((r) => r.data),
  restoreDeleted: (table: string, id: string) =>
    http.post<{ ok: boolean }>("/api/deleted", { table, id }).then((r) => r.data),
  permanentlyDelete: (table: string, id: string) =>
    http.delete<{ ok: boolean }>("/api/deleted", { data: { table, id } }).then((r) => r.data),
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
