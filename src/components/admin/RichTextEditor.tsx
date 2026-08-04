"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "indent",
  "blockquote",
  "code-block",
  "link",
  "image",
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  error,
}: RichTextEditorProps) {
  return (
    <div>
      <div
        className={`rich-text-editor rounded-xl border bg-cream transition-all ${
          error
            ? "border-secondary/60 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20"
            : "border-primary focus-within:border-primary-dark focus-within:ring-2 focus-within:ring-primary/30 hover:border-primary-dark"
        }`}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || "Write something..."}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-secondary">{error}</p>
      )}

      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-family: inherit;
          font-size: 0.875rem;
          min-height: 180px;
          border: none;
        }
        .rich-text-editor .ql-editor {
          min-height: 180px;
          padding: 0.75rem 1rem;
          color: #0b2b1d;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgba(11, 43, 29, 0.35);
          font-style: normal;
        }
        .rich-text-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid rgba(12, 155, 93, 0.15);
          background: rgba(230, 247, 239, 0.5);
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 0.5rem;
        }
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: #0b2b1d;
        }
        .rich-text-editor .ql-snow .ql-fill {
          fill: #0b2b1d;
        }
        .rich-text-editor .ql-snow .ql-picker {
          color: #0b2b1d;
        }
        .rich-text-editor .ql-snow .ql-active .ql-stroke {
          stroke: #0c9b5d;
        }
        .rich-text-editor .ql-snow .ql-active .ql-fill {
          fill: #0c9b5d;
        }
        .rich-text-editor .ql-snow .ql-active {
          color: #0c9b5d;
        }
        .rich-text-editor .ql-snow .ql-picker-options {
          background: white;
          border-color: rgba(12, 155, 93, 0.2);
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .rich-text-editor .ql-editor pre.ql-syntax,
        .rich-text-editor .ql-editor code {
          background: #f3f4f6;
          border-radius: 0.375rem;
        }
        .rich-text-editor .ql-editor blockquote {
          border-left: 3px solid #0c9b5d;
          padding-left: 0.75rem;
          color: #4a6555;
        }
      `}</style>
    </div>
  );
}
