"use client";

import Certificate from "@/features/certificates/components/Certificate";
import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import { quizSets, type QuizSet } from "@/features/quiz/data/quiz";
import { api } from "@/lib/api";
import { ArrowLeft, ListChecks, Timer, Trophy } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { toast } from "react-toastify";

type Step = "select" | "form" | "quiz" | "result";

const PASSING_SCORE = 70;

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const optionLabels = ["A", "B", "C", "D"];

export default function Quiz() {
  const [quizSetsList, setQuizSetsList] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<QuizSet | null>(null);
  const questions = useMemo(() => selectedSet?.questions ?? [], [selectedSet]);
  const [step, setStep] = useState<Step>("select");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [takenError, setTakenError] = useState("");
  const [issuedCertificateId, setIssuedCertificateId] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .list<QuizSet>("quizsets")
      .then((list) => {
        if (!cancelled) {
          setQuizSetsList(list.length > 0 ? list : quizSets);
          setLoading(false);
        }
      })
      .catch(() => {
        setQuizSetsList(quizSets);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const transitionTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const total = questions.length;
    const score = questions.filter(
      (q, idx) => answers[idx] === q.correctIndex,
    ).length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    if (percentage >= 80) {
      try {
        const cert = await api.create<{ certificateId: string }>(
          "certificates",
          {
            name,
            phone,
            percentage,
            score,
            total,
            quizTitle: selectedSet?.title ?? "",
            date: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
        );
        setIssuedCertificateId(cert.certificateId);
        if (typeof window !== "undefined") {
          window.open(
            `/certificate/${cert.certificateId}`,
            "_blank",
            "noopener,noreferrer",
          );
        }
        setSubmitting(false);
        transitionTo("result");
        return;
      } catch (err) {
        // Saving failed — show the in-page result instead.
        toast.error(
          err instanceof Error
            ? err.message
            : "Certificate could not be issued. Please try again.",
        );
        setSubmitting(false);
        transitionTo("result");
        return;
      }
    }

    setSubmitting(false);
    transitionTo("result");
  }, [submitting, questions, answers, name, phone, selectedSet]);

  useEffect(() => {
    if (step !== "quiz") return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        void submitQuiz();
        return;
      }
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, timeLeft, submitQuiz]);

  const selectQuizSet = (set: QuizSet) => {
    setSelectedSet(set);
    setTakenError("");
    transitionTo("form");
  };

  const startQuiz = async (e: FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string } = {};
    if (name.trim().length < 3) {
      errors.name = "নাম কমপক্ষে ৩টি অক্ষর হতে হবে";
    }
    if (!/^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/.test(phone.trim())) {
      errors.phone = "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)";
    }
    setFormErrors(errors);
    setTakenError("");
    if (Object.keys(errors).length > 0) return;

    setStarting(true);
    try {
      const quizTitle = selectedSet?.title ?? "";
      const { taken } = await api.checkCertificate(phone.trim(), quizTitle);
      if (taken) {
        setTakenError(
          "You have already taken this quiz. Each phone number can take a quiz only once.",
        );
        return;
      }
    } finally {
      setStarting(false);
    }
    setAnswers({});
    setTimeLeft(selectedSet?.durationSeconds ?? 10 * 60);
    transitionTo("quiz");
  };

  const restart = () => {
    setAnswers({});
    setTimeLeft(selectedSet?.durationSeconds ?? 10 * 60);
    setName("");
    setPhone("");
    setSelectedSet(null);
    setFormErrors({});
    setTakenError("");
    setIssuedCertificateId("");
    transitionTo("select");
  };

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const score = questions.filter(
    (q, idx) => answers[idx] === q.correctIndex,
  ).length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const resultMessage =
    percentage >= 80
      ? "দারুণ! আপনি সাইবার সচেতনতা নিয়ে চমৎকার জ্ঞান রাখেন।"
      : percentage >= 50
        ? "ভালো হয়েছে! আরও কিছু শিখলে আপনি একদম নিখুঁত হয়ে যাবেন।"
        : "চিন্তা নেই! শেখা চলমান — আবার চেষ্টা করুন, সফল হবেন।";

  return (
    <section className="section-anchor py-16 lg:py-24">
      <Container>
        <div key={step} className="animate-fade-in">
          {step === "select" && (
            <div className="w-full">
              <span className="inline-flex rounded-full bg-primary-lighter px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                Cyber Awareness Quiz
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
                Choose a Quiz
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                Select a quiz set to test your knowledge on cybersecurity and
                digital literacy.
              </p>

              <div className="mt-8 space-y-4">
                {loading
                  ? [0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-full rounded-3xl border-2 border-ink/5 bg-white p-6 shadow-sm"
                      >
                        <div className="h-5 w-2/3 animate-pulse rounded-full bg-mist" />
                        <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-mist" />
                        <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-mist" />
                        <div className="mt-4 flex flex-wrap gap-3">
                          <div className="h-6 w-20 animate-pulse rounded-full bg-mist" />
                          <div className="h-6 w-24 animate-pulse rounded-full bg-mist" />
                          <div className="h-6 w-28 animate-pulse rounded-full bg-mist" />
                        </div>
                      </div>
                    ))
                  : quizSetsList.map((set, idx) => (
                      <Hoverable key={idx} className="w-full">
                      <button
                        type="button"
                        onClick={() => selectQuizSet(set)}
                        className="group relative w-full rounded-3xl bg-linear-to-br from-primary/40 via-primary/10 to-secondary/40 p-px text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
                      >
                        <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-white p-6">
                          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-secondary/20" />
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-primary">
                            {set.title}
                          </h3>
                          <p className="mt-1 text-sm text-ink-soft">
                            {set.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-soft">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-lighter px-3 py-1 font-semibold text-primary">
                              <Timer className="h-3.5 w-3.5" />
                              {set.durationSeconds / 60} min
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-600">
                              <Trophy className="h-3.5 w-3.5" />
                              Pass: {PASSING_SCORE}%
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-light px-3 py-1 font-semibold text-secondary">
                              <ListChecks className="h-3.5 w-3.5" />
                              {set.questions?.length} questions
                            </span>
                          </div>
                        </div>
                      </button>
                      </Hoverable>
                    ))}
              </div>
            </div>
          )}

          {step === "form" && (
            <div className="w-full">
              <span className="inline-flex rounded-full bg-primary-lighter px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                {selectedSet?.title || "Cyber Awareness Quiz"}
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
                Start the Quiz
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                আপনার নাম ও ফোন নম্বর দিয়ে কুইজ শুরু করুন। মোট {total}টি প্রশ্ন
                এবং সময় {(selectedSet?.durationSeconds ?? 10 * 60) / 60} মিনিট।
              </p>
              <button
                type="button"
                onClick={() => transitionTo("select")}
                className="mt-4 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft size={15} /> Choose a different quiz
              </button>

              <form
                onSubmit={startQuiz}
                className="mt-8 space-y-5 rounded-3xl border border-ink/5 bg-white p-6 shadow-sm sm:p-8"
              >
                <div>
                  <label
                    htmlFor="quiz-name"
                    className="text-sm font-semibold text-ink"
                  >
                    Your Name
                  </label>
                  <input
                    id="quiz-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name)
                        setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Ex: Mehedi Hasan"
                    className={`mt-2 w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      formErrors.name ? "border-secondary" : "border-ink/10"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="quiz-phone"
                    className="text-sm font-semibold text-ink"
                  >
                    Phone Number
                  </label>
                  <input
                    id="quiz-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formErrors.phone)
                        setFormErrors((prev) => ({
                          ...prev,
                          phone: undefined,
                        }));
                      if (takenError) setTakenError("");
                    }}
                    placeholder="Ex: 01XXXXXXXXX"
                    className={`mt-2 w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      formErrors.phone ? "border-secondary" : "border-ink/10"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                {takenError && (
                  <div className="rounded-xl border-2 border-secondary/30 bg-secondary-light px-4 py-3 text-sm font-medium text-secondary">
                    {takenError}
                  </div>
                )}
                <Hoverable>
                  <button
                    type="submit"
                    disabled={starting}
                    className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-ink/30 disabled:shadow-none"
                  >
                    {starting ? "Checking..." : "কুইজ শুরু করুন →"}
                  </button>
                </Hoverable>
              </form>
            </div>
          )}

          {step === "quiz" && (
            <div>
              <div className="sticky top-4 z-10 rounded-2xl border border-ink/5 bg-white/90 p-4 shadow-lg backdrop-blur sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">
                      {name}
                    </p>
                    <p className="text-xs text-ink-soft">{phone}</p>
                  </div>
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      timeLeft <= 60
                        ? "bg-secondary text-white"
                        : "bg-primary-lighter text-primary"
                    }`}
                  >
                    ⏱ {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm font-semibold text-ink-soft">
                    Answered {answeredCount}/{total}
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${(answeredCount / total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {questions.map((q, qIndex) => {
                  const selected = answers[qIndex];
                  return (
                    <div
                      key={qIndex}
                      className="rounded-3xl border border-ink/5 bg-white p-6 shadow-sm sm:p-8"
                    >
                      <p className="text-base font-bold leading-snug text-ink sm:text-lg">
                        <span className="text-primary">{qIndex + 1}.</span>{" "}
                        {q.question}
                      </p>
                      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {q.options.map((option, oIndex) => {
                          const active = selected === oIndex;
                          return (
                            <button
                              key={oIndex}
                              type="button"
                              onClick={() =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [qIndex]: oIndex,
                                }))
                              }
                              className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
                                active
                                  ? "border-primary bg-primary-tint text-ink"
                                  : "border-ink/5 bg-cream text-ink-soft hover:border-primary/40 hover:text-ink"
                              }`}
                            >
                              <span
                                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                                  active
                                    ? "bg-primary text-white"
                                    : "bg-white text-ink-soft"
                                }`}
                              >
                                {optionLabels[oIndex]}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <Hoverable>
                  <button
                    type="button"
                    onClick={() => void submitQuiz()}
                    disabled={submitting}
                    className="w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-ink/30 disabled:shadow-none sm:w-auto sm:px-12"
                  >
                    {submitting ? "Submitting..." : "Submit Answers"}
                  </button>
                </Hoverable>
                <p className="text-xs text-ink-soft">
                  সময় শেষ হলে উত্তর জমা হয়ে যাবে এবং আপনার প্রাপ্ত নম্বর
                  দেখানো হবে।
                </p>
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="w-full">
              <div className="rounded-3xl border border-ink/5 bg-white p-8 text-center shadow-xl sm:p-10">
                <span className="inline-flex rounded-full bg-primary-lighter px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                  Quiz Result
                </span>
                <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
                  {name}
                </h1>
                <p className="mt-1 text-sm text-ink-soft">{phone}</p>

                <div
                  className={`mx-auto mt-6 grid h-36 w-36 place-items-center rounded-full border-8 text-4xl font-extrabold ${
                    percentage >= 80
                      ? "border-primary text-primary"
                      : percentage >= 50
                        ? "border-secondary text-secondary"
                        : "border-ink/15 text-ink-soft"
                  }`}
                >
                  {percentage}%
                </div>
                <p className="mt-5 text-lg font-bold text-ink">
                  {resultMessage}
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  আপনি {total}টির মধ্যে {score}টি সঠিক উত্তর দিয়েছেন।
                </p>

                <Hoverable>
                  <button
                    type="button"
                    onClick={restart}
                    className="mt-7 rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
                  >
                    আবার চেষ্টা করুন
                  </button>
                </Hoverable>
              </div>

              {percentage >= 80 && (
                <div className="mt-10">
                  <Certificate
                    embed
                    name={name}
                    percentage={percentage}
                    phone={phone}
                    certificateId={issuedCertificateId || undefined}
                    quizTitle={selectedSet?.title ?? ""}
                  />
                </div>
              )}

              <div className="mt-8 space-y-3">
                {questions.map((q, qIndex) => {
                  const selected = answers[qIndex];
                  const correct = selected === q.correctIndex;
                  return (
                    <div
                      key={qIndex}
                      className={`flex items-start gap-3 rounded-2xl border p-4 ${
                        correct
                          ? "border-primary/30 bg-primary-tint"
                          : "border-secondary/20 bg-secondary-tint"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${
                          correct ? "bg-primary" : "bg-secondary"
                        }`}
                      >
                        {correct ? "✓" : "✕"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-snug text-ink">
                          {qIndex + 1}. {q.question}
                        </p>
                        <p className="mt-1 text-xs text-ink-soft">
                          সঠিক উত্তর:{" "}
                          <span className="font-semibold text-primary">
                            {optionLabels[q.correctIndex]}.{" "}
                            {q.options[q.correctIndex]}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
