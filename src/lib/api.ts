import { useState, useEffect } from "react";
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
    },
  ) =>
    http
      .get<PagedResult<T>>(`/api/${table}`, { params })
      .then((r) => r.data),
  get: <T>(table: string, id: string) =>
    http.get<T>(`/api/${table}/${id}`).then((r) => r.data),
  create: <T>(table: string, data: unknown) =>
    http.post<T>(`/api/${table}`, data).then((r) => r.data),
  update: <T>(table: string, id: string, data: unknown) =>
    http.put<T>(`/api/${table}/${id}`, data).then((r) => r.data),
  remove: (table: string, id: string) =>
    http.delete<{ ok: boolean }>(`/api/${table}/${id}`).then((r) => r.data),
};

export function useTable<T>(
  table: string,
  fallback: T[],
): [T[], boolean] {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .list<T>(table)
      .then((result) => {
        if (!cancelled) setData(result.length > 0 ? result : fallback);
      })
      .catch(() => {
        if (!cancelled) setData(fallback);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [table, fallback]);

  return [data, loading];
}

export function useTableQuery<T>(table: string) {
  return useQuery({
    queryKey: ["table", table],
    queryFn: () => api.list<T>(table),
  });
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
