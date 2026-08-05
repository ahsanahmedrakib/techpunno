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
  list: <T>(collection: string) =>
    http.get<T[]>(`/api/${collection}`).then((r) => r.data),
  paged: <T>(
    collection: string,
    params: { page: number; pageSize: number; search?: string },
  ) =>
    http
      .get<PagedResult<T>>(`/api/${collection}`, { params })
      .then((r) => r.data),
  get: <T>(collection: string, id: string) =>
    http.get<T>(`/api/${collection}/${id}`).then((r) => r.data),
  create: <T>(collection: string, data: unknown) =>
    http.post<T>(`/api/${collection}`, data).then((r) => r.data),
  update: <T>(collection: string, id: string, data: unknown) =>
    http.put<T>(`/api/${collection}/${id}`, data).then((r) => r.data),
  remove: (collection: string, id: string) =>
    http.delete<{ ok: boolean }>(`/api/${collection}/${id}`).then((r) => r.data),
};

export function useCollection<T>(
  collection: string,
  fallback: T[],
): [T[], boolean] {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .list<T>(collection)
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
  }, [collection]);

  return [data, loading];
}

export function useCollectionQuery<T>(collection: string) {
  return useQuery({
    queryKey: ["collection", collection],
    queryFn: () => api.list<T>(collection),
  });
}

export function useCreateDoc(collection: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.create(collection, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collection", collection] }),
  });
}

export function useUpdateDoc(collection: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.update(collection, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collection", collection] }),
  });
}

export function useDeleteDoc(collection: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.remove(collection, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collection", collection] }),
  });
}
