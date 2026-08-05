"use client";

import type { FieldDef } from "@/lib/collections";
import axios from "axios";
import { Camera } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "./RichTextEditor";
import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import QuestionsEditor, { type QuizQuestionData } from "./QuestionsEditor";

const FileRegistryContext = createContext<React.MutableRefObject<
  Map<string, File>
> | null>(null);

interface RecordFormProps {
  fields: FieldDef[];
  initial?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function toFormValues(
  fields: FieldDef[],
  initial?: Record<string, unknown>,
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    if (field.type === "readonly") continue;
    const val = initial?.[field.name];
    if (field.type === "list" && Array.isArray(val))
      values[field.name] = val.join("\n");
    else if (field.type === "number" && typeof val === "number")
      values[field.name] = String(val);
    else values[field.name] = String(val ?? "");
  }
  return values;
}

function toPayload(
  fields: FieldDef[],
  values: Record<string, string>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "readonly") continue;
    const raw = values[field.name] ?? "";
    if (field.type === "number")
      payload[field.name] = raw === "" ? null : Number(raw);
    else if (field.type === "list")
      payload[field.name] = raw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    else payload[field.name] = raw;
  }
  return payload;
}

const baseInput = (error?: string) =>
  `w-full rounded-xl border bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 focus:ring-2 ${
    error
      ? "border-secondary/60 focus:border-secondary focus:ring-secondary/20"
      : "border-primary focus:border-primary-dark focus:ring-primary/30 hover:border-primary-dark"
  }`;

function ImageUpload({
  field,
  value,
  onChange,
  error,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const registry = useContext(FileRegistryContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(() =>
    value && !value.startsWith("__pending:")
      ? value.split("/").pop() ?? null
      : null,
  );
  const [preview, setPreview] = useState<string | null>(() =>
    value && !value.startsWith("__pending:") ? value : null,
  );
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    if (value && !value.startsWith("__pending:")) {
      setFileName(value.split("/").pop() ?? null);
      setPreview(value);
    } else if (!value) {
      setFileName(null);
      setPreview(null);
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    registry?.current.set(field.name, file);
    onChange(`__pending:${file.name}`);
  };

  const clear = () => {
    setFileName(null);
    setPreview(null);
    registry?.current.delete(field.name);
    onChange("");
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div
        onClick={() => inputRef.current?.click()}
        className="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-primary/40 bg-cream p-3 transition-all hover:border-primary hover:shadow-sm"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-primary/30 bg-mist">
          {preview ? (
            <Image
              src={preview}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              unoptimized={preview.startsWith("data:")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-soft/30">
              <Camera className="h-7 w-7" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {fileName || "No image selected"}
          </p>
          <p className="text-[11px] text-ink-soft/60">
            {preview ? "Click to change" : "Click to browse"}
          </p>
        </div>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            className="shrink-0 rounded-lg border border-secondary/20 px-2.5 py-1.5 text-[11px] font-medium text-secondary transition-all hover:bg-secondary-light"
          >
            Remove
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-secondary">{error}</p>
      )}
    </div>
  );
}

async function uploadPending(
  registry: Map<string, File>,
): Promise<Record<string, string>> {
  const entries = Array.from(registry.entries());
  if (entries.length === 0) return {};

  const results: Record<string, string> = {};
  for (const [fieldName, file] of entries) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("dir", "uploads");
    try {
      const res = await axios.post<{ path?: string }>("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.path) results[fieldName] = res.data.path;
    } catch {
      /* skip failed uploads */
    }
  }
  return results;
}

export default function RecordForm({
  fields,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: RecordFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    toFormValues(fields, initial),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileRegistry = useRef<Map<string, File>>(new Map());

  const questionsField = fields.find((f) => f.type === "questions");
  const [questionsData, setQuestionsData] = useState<QuizQuestionData[]>(() => {
    const initialQ = initial?.questions;
    if (Array.isArray(initialQ) && initialQ.length > 0) {
      return initialQ as QuizQuestionData[];
    }
    return [{ question: "", options: ["", "", "", ""], correctIndex: 0 }];
  });

  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setValues(toFormValues(fields, initial));
    setErrors({});
    const initialQ = initial?.questions;
    if (Array.isArray(initialQ) && initialQ.length > 0) {
      setQuestionsData(initialQ as QuizQuestionData[]);
    } else if (questionsField) {
      setQuestionsData([
        { question: "", options: ["", "", "", ""], correctIndex: 0 },
      ]);
    }
  }

  const setValue = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    for (const field of fields) {
      if (field.type === "readonly" || !field.required) continue;
      if (field.type === "questions") {
        if (questionsData.length === 0 || !questionsData[0]?.question.trim()) {
          errs[field.name] = "At least one question is required";
        }
        continue;
      }
      const raw = values[field.name] ?? "";
      if (!raw.trim()) {
        errs[field.name] = `${field.label} is required`;
        continue;
      }
      if (field.type === "number" && isNaN(Number(raw))) {
        errs[field.name] = `${field.label} must be a number`;
        continue;
      }
      if (field.min !== undefined && raw) {
        const num = Number(raw);
        if (!isNaN(num) && num < field.min) {
          errs[field.name] = `${field.label} must be at least ${field.min}`;
        }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const uploaded = await uploadPending(fileRegistry.current);
      const resolved = { ...values };
      for (const [k, v] of Object.entries(uploaded)) {
        resolved[k] = v;
      }
      fileRegistry.current.clear();
      const payload = toPayload(fields, resolved);
      if (questionsField) {
        payload.questions = questionsData;
      }
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const cls = (err?: string) => baseInput(err);

  return (
    <FileRegistryContext.Provider value={fileRegistry}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={
                field.type === "textarea" ||
                field.type === "richtext" ||
                field.type === "list" ||
                field.type === "image" ||
                field.type === "questions"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-secondary">*</span>
                )}
              </label>

              {field.type === "textarea" || field.type === "list" ? (
                <div>
                  <textarea
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    rows={field.type === "list" ? 5 : 4}
                    placeholder={
                      field.type === "list"
                        ? "One item per line..."
                        : field.placeholder
                    }
                    className={`${cls(errors[field.name])} resize-none`}
                  />
                  {field.type === "list" && (
                    <p className="mt-1 text-[11px] text-ink-soft/60">
                      One item per line
                    </p>
                  )}
                  {errors[field.name] && (
                    <p className="mt-1 text-xs font-medium text-secondary">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ) : field.type === "questions" ? (
                <QuestionsEditor
                  value={questionsData}
                  onChange={setQuestionsData}
                  error={errors[field.name]}
                />
              ) : field.type === "richtext" ? (
                <RichTextEditor
                  value={values[field.name] ?? ""}
                  onChange={(val) => setValue(field.name, val)}
                  placeholder={field.placeholder}
                  error={errors[field.name]}
                />
              ) : field.type === "number" ? (
                <div>
                  <input
                    type="number"
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    min={field.min}
                    className={cls(errors[field.name])}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs font-medium text-secondary">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ) : field.type === "select" ? (
                <div>
                  <select
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className={`${cls(errors[field.name])} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%230c9b5d%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")] bg-size-[10px] bg-position-[right_12px_center] bg-no-repeat pr-10`}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && (
                    <p className="mt-1 text-xs font-medium text-secondary">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ) : field.type === "readonly" ? (
                <input
                  type="text"
                  value={values[field.name] ?? ""}
                  disabled
                  className={`${cls(errors[field.name])} cursor-not-allowed bg-mist/50 opacity-50`}
                />
              ) : field.type === "image" ? (
                <ImageUpload
                  field={field}
                  value={values[field.name] ?? ""}
                  onChange={(v) => setValue(field.name, v)}
                  error={errors[field.name]}
                />
              ) : (
                <div>
                  <input
                    type="text"
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={cls(errors[field.name])}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs font-medium text-secondary">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t-2 border-primary/20 pt-5">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <span className="inline-block h-4 w-4 animate-pulse rounded bg-primary/30" />
            )}
            {submitting ? "Saving..." : submitLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border-2 border-primary/30 px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-mist hover:border-primary/50"
          >
            Cancel
          </button>
        </div>
      </form>
    </FileRegistryContext.Provider>
  );
}

