"use client";

import { quizDurationSeconds, quizQuestions } from "@/data/quiz";
import { site } from "@/data/site";
import Hoverable from "@/components/common/Hoverable";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

type Step = "form" | "quiz" | "result";

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const optionLabels = ["A", "B", "C", "D"];

const loadImageAsDataUrl = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

export default function Quiz() {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(quizDurationSeconds);
  const [downloading, setDownloading] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadImageAsDataUrl(site.logo)
      .then((url) => {
        if (!cancelled) setLogoDataUrl(url);
      })
      .catch(() => console.error("Failed to load logo for certificate"));
    return () => {
      cancelled = true;
    };
  }, []);

  const downloadCertificate = async () => {
    const el = document.getElementById("certificate-print");
    if (!el) return;
    setDownloading(true);
    const originalShadow = el.style.boxShadow;
    el.style.boxShadow = "none";
    const logoImg = el.querySelector("img");
    const elRect = logoImg ? el.getBoundingClientRect() : null;
    const logoRect = logoImg?.getBoundingClientRect() ?? null;
    const originalDisplay = logoImg?.style.display;
    if (logoImg) logoImg.style.display = "none";
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      if (logoImg && logoRect && elRect) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const src = logoDataUrl ?? (await loadImageAsDataUrl(site.logo));
          const logo = new window.Image();
          await new Promise<void>((resolve, reject) => {
            logo.onload = () => resolve();
            logo.onerror = () => reject(new Error("Failed to load logo"));
            logo.src = src;
          });
          const scale = canvas.width / elRect.width;
          const boxX = (logoRect.left - elRect.left) * scale;
          const boxY = (logoRect.top - elRect.top) * scale;
          const boxW = logoRect.width * scale;
          const boxH = logoRect.height * scale;
          const imgAspect = logo.naturalWidth / logo.naturalHeight;
          const boxAspect = boxW / boxH;
          let drawW = boxW;
          let drawH = boxH;
          if (imgAspect > boxAspect) {
            drawH = boxW / imgAspect;
          } else {
            drawW = boxH * imgAspect;
          }
          const drawX = boxX + (boxW - drawW) / 2;
          const drawY = boxY + (boxH - drawH) / 2;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxW, boxH, 32);
          ctx.clip();
          ctx.drawImage(logo, drawX, drawY, drawW, drawH);
          ctx.restore();
        }
      }
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const aspect = canvas.width / canvas.height;
      let w = pageW;
      let h = pageW / aspect;
      if (h > pageH) {
        h = pageH;
        w = pageH * aspect;
      }
      pdf.addImage(imgData, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
      const safeName = name.trim().replace(/\s+/g, "-") || "Quiz";
      pdf.save(`TechPunno-Certificate-${safeName}.pdf`);
    } catch (error) {
      console.error("Certificate download failed:", error);
    } finally {
      if (logoImg) logoImg.style.display = originalDisplay ?? "";
      el.style.boxShadow = originalShadow;
      setDownloading(false);
    }
  };

  const transitionTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (step !== "quiz") return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        transitionTo("result");
        return;
      }
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const startQuiz = (e: FormEvent) => {
    e.preventDefault();
    setAnswers({});
    setTimeLeft(quizDurationSeconds);
    transitionTo("quiz");
  };

  const restart = () => {
    setAnswers({});
    setTimeLeft(quizDurationSeconds);
    setName("");
    setPhone("");
    transitionTo("form");
  };

  const total = quizQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const resultMessage =
    percentage >= 80
      ? "দারুণ! আপনি সাইবার সচেতনতা নিয়ে চমৎকার জ্ঞান রাখেন।"
      : percentage >= 50
        ? "ভালো হয়েছে! আরও কিছু শিখলে আপনি একদম নিখুঁত হয়ে যাবেন।"
        : "চিন্তা নেই! শেখা চলমান — আবার চেষ্টা করুন, সফল হবেন।";

  return (
    <section className="section-anchor mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      {step === "form" && (
        <div className="mx-auto max-w-lg">
          <span className="inline-flex rounded-full bg-primary-lighter px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            Cyber Awareness Quiz
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Start the Quiz
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
            আপনার নাম ও ফোন নম্বর দিয়ে কুইজ শুরু করুন। মোট {total}টি প্রশ্ন এবং
            সময় {quizDurationSeconds / 60} মিনিট।
          </p>

          <form
            onSubmit={startQuiz}
            className="mt-8 space-y-5 rounded-3xl border border-ink/5 bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label
                htmlFor="quiz-name"
                className="text-sm font-semibold text-ink"
              >
                আপনার নাম
              </label>
              <input
                id="quiz-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রাকিব হাসান"
                className="mt-2 w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label
                htmlFor="quiz-phone"
                className="text-sm font-semibold text-ink"
              >
                ফোন নম্বর
              </label>
              <input
                id="quiz-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="যেমন: 01XXXXXXXXX"
                className="mt-2 w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Hoverable>
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              কুইজ শুরু করুন →
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
                <p className="truncate text-sm font-bold text-ink">{name}</p>
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
            {quizQuestions.map((q, qIndex) => {
              const selected = answers[q.id];
              return (
                <div
                  key={q.id}
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
                              [q.id]: oIndex,
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
              onClick={() => transitionTo("result")}
              disabled={timeLeft <= 0}
              className="w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-ink/30 disabled:shadow-none sm:w-auto sm:px-12"
            >
              Submit Answers
            </button>
            </Hoverable>
            <p className="text-xs text-ink-soft">
              সময় শেষ হলে উত্তর জমা হয়ে যাবে এবং আপনার প্রাপ্ত নম্বর দেখানো
              হবে।
            </p>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="mx-auto max-w-3xl">
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
            <p className="mt-5 text-lg font-bold text-ink">{resultMessage}</p>
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
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="text-2xl font-bold text-ink">
                    Congratulations, {name}!
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    আপনি {percentage}% নম্বর পেয়েছেন — আপনার সাইবার সচেতনতার
                    সার্টিফিকেট তৈরি হয়েছে।
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row">
                  <Hoverable>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    🖨 Print Preview
                  </button>
                  </Hoverable>
                  <Hoverable>
                  <button
                    type="button"
                    onClick={downloadCertificate}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloading
                      ? "Preparing PDF..."
                      : "⬇ Download Certificate (PDF)"}
                  </button>
                  </Hoverable>
                </div>
              </div>

              <div
                id="certificate-print"
                className="mx-auto mt-6 w-full max-w-4xl bg-white text-ink shadow-2xl"
              >
                <div className="aspect-297/210 w-full print:h-[168mm] print:w-[237.6mm]">
                  <div className="flex h-full w-full flex-col items-center justify-center border-10 border-double border-primary p-6 text-center print:scale-125 sm:p-10">
                    <span className="inline-block h-20 w-20 overflow-hidden rounded-2xl bg-primary-lighter ring-2 ring-primary/20">
                      {logoDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoDataUrl}
                          alt={`${site.name} logo`}
                          width={80}
                          height={80}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Image
                          src={site.logo}
                          alt={`${site.name} logo`}
                          width={80}
                          height={80}
                          className="h-full w-full object-contain"
                        />
                      )}
                    </span>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.35em] text-primary sm:text-sm">
                      TechPunno
                    </p>
                    <h2 className="mt-4 text-xl font-extrabold tracking-widest text-ink sm:text-3xl">
                      CERTIFICATE OF ACHIEVEMENT
                    </h2>
                    <p className="mt-6 text-xs text-ink-soft sm:text-sm">
                      This certificate is proudly presented to
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-primary sm:text-5xl">
                      {name}
                    </p>
                    <p className="mt-5 max-w-lg text-xs leading-relaxed text-ink-soft sm:text-sm">
                      for successfully completing the{" "}
                      <span className="font-semibold text-ink">
                        TechPunno Cyber Awareness Quiz
                      </span>{" "}
                      with an outstanding score of
                    </p>
                    <p className="mt-2 text-6xl font-extrabold text-ink sm:text-7xl">
                      {percentage}%
                    </p>
                    <p className="mt-5 text-xs text-ink-soft sm:text-sm">
                      Certificate ID:{" "}
                      <span className="font-semibold text-ink">
                        TP-{new Date().getFullYear()}-{String(phone).slice(-4)}
                      </span>{" "}
                      · Date:{" "}
                      <span className="font-semibold text-ink">
                        {new Date().toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    <div className="mt-10 flex w-full max-w-lg items-end justify-between gap-6">
                      <div className="flex-1">
                        <div className="border-t-2 border-ink/30 pt-2">
                          <p className="text-sm font-bold text-ink">
                            TechPunno
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-ink-soft">
                            Organization
                          </p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="border-t-2 border-ink/30 pt-2">
                          <p className="text-sm font-bold text-ink">
                            Mehedi Hasan
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-ink-soft">
                            Founder
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {quizQuestions.map((q, qIndex) => {
              const selected = answers[q.id];
              const correct = selected === q.correctIndex;
              return (
                <div
                  key={q.id}
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
    </section>
  );
}

