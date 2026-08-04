"use client";

import { useState } from "react";

export type QuizQuestionData = {
  question: string;
  options: string[];
  correctIndex: number;
};

interface QuestionsEditorProps {
  value: QuizQuestionData[];
  onChange: (questions: QuizQuestionData[]) => void;
  error?: string;
}

export default function QuestionsEditor({
  value,
  onChange,
  error,
}: QuestionsEditorProps) {
  const [questions, setQuestions] = useState<QuizQuestionData[]>(
    value.length > 0 ? value : [{ question: "", options: ["", "", "", ""], correctIndex: 0 }],
  );

  const update = (idx: number, patch: Partial<QuizQuestionData>) => {
    const next = questions.map((q, i) => (i === idx ? { ...q, ...patch } : q));
    setQuestions(next);
    onChange(next);
  };

  const addQuestion = () => {
    const next = [...questions, { question: "", options: ["", "", "", ""], correctIndex: 0 }];
    setQuestions(next);
    onChange(next);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    const next = questions.filter((_, i) => i !== idx);
    setQuestions(next);
    onChange(next);
  };

  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    const q = questions[qIdx];
    const options = [...q.options];
    options[oIdx] = val;
    update(qIdx, { options });
  };

  const addOption = (qIdx: number) => {
    const q = questions[qIdx];
    update(qIdx, { options: [...q.options, ""] });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const q = questions[qIdx];
    if (q.options.length <= 2) return;
    const options = q.options.filter((_, i) => i !== oIdx);
    const correctIndex = q.correctIndex >= options.length ? 0 : q.correctIndex;
    update(qIdx, { options, correctIndex });
  };

  return (
    <div className="space-y-4">
      {questions.map((q, qIdx) => (
        <div
          key={qIdx}
          className="rounded-xl border-2 border-primary/20 bg-cream/50 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-primary">
              Question {qIdx + 1}
            </span>
            <button
              type="button"
              onClick={() => removeQuestion(qIdx)}
              disabled={questions.length <= 1}
              className="rounded-lg border border-secondary/20 px-2.5 py-1 text-[11px] font-medium text-secondary transition-all hover:bg-secondary-light disabled:opacity-30"
            >
              Remove
            </button>
          </div>

          <textarea
            value={q.question}
            onChange={(e) => update(qIdx, { question: e.target.value })}
            rows={2}
            placeholder="Enter question..."
            className="mb-3 w-full resize-none rounded-xl border border-primary/25 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div className="space-y-2">
            {q.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update(qIdx, { correctIndex: oIdx })}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                    q.correctIndex === oIdx
                      ? "bg-primary text-white shadow-sm"
                      : "border border-ink/15 bg-white text-ink-soft hover:border-primary/40"
                  }`}
                  title="Mark as correct answer"
                >
                  {String.fromCharCode(65 + oIdx)}
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                  className="flex-1 rounded-lg border border-primary/20 bg-white px-3 py-1.5 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/40 focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qIdx, oIdx)}
                    className="shrink-0 text-ink-soft/40 hover:text-secondary"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qIdx)}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              + Add option
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="w-full rounded-xl border-2 border-dashed border-primary/30 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary/60 hover:bg-primary-lighter/30"
      >
        + Add Question
      </button>

      {error && (
        <p className="text-xs font-medium text-secondary">{error}</p>
      )}
    </div>
  );
}
