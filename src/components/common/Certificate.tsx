"use client";

import { useRef } from "react";

interface CertificateProps {
  name?: string;
  percentage?: number;
  phone?: string;
  date?: string;
  embed?: boolean;
}

export default function Certificate({
  name = "Suraiya Islam Labonno",
  percentage,
  phone = "",
  date,
  embed = false,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const displayDate =
    date ||
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const certId = `TP-${new Date().getFullYear()}-${String(phone).slice(-4) || "0000"}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 0,
      filename: `Certificate_${name.trim().replace(/\s+/g, "_") || "Quiz"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    } as const;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div
      className={
        embed
          ? "flex flex-col items-center font-serif"
          : "flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 font-serif md:p-8"
      }
    >
      {/* Action Buttons */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 font-sans font-medium text-white shadow-md transition hover:bg-blue-800"
        >
          🖨️ Print Certificate
        </button>
        <button
          onClick={handleDownloadPDF}
          className="cursor-pointer rounded-lg bg-emerald-700 px-5 py-2.5 font-sans font-medium text-white shadow-md transition hover:bg-emerald-800"
        >
          📥 Download PDF
        </button>
      </div>

      {/* Certificate Frame - Using max-w-262.5 (1050px) */}
      <div className="w-full max-w-262.5 overflow-x-auto rounded-sm shadow-2xl print:shadow-none print:m-0 print:p-0">
        <div
          ref={certificateRef}
          id="certificate-content"
          className="relative box-border flex h-185.5 w-262.5 flex-col justify-between border-3 border-white bg-[#f8f9f2] p-8 text-gray-800 select-none print:h-[210mm] print:w-[297mm] print:border-none"
        >
          {/* Top Decorative Shapes */}
          <div className="absolute top-0 left-0 h-16 w-80 bg-[#1a3a68] [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]" />
          <div className="absolute top-0 left-85 h-2 w-36 bg-[#f0a828]" />

          {/* Bottom Decorative Shapes */}
          <div className="absolute right-0 bottom-0 h-20 w-96 bg-[#1a3a68] [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
          <div className="absolute bottom-0 left-12 h-1.5 w-80 bg-[#f0a828]" />

          {/* Left/Right Decorative Bars */}
          <div className="absolute top-16 left-0 h-80 w-8 bg-[#1a3a68]" />
          <div className="absolute top-72 right-0 h-96 w-8 bg-[#1a3a68]" />

          {/* Header Section */}
          <div className="relative z-10 flex justify-between px-12 pt-4 items-start">
            <div className="flex-1 pr-12 text-center">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gray-700">
                Tech Punno Presents
              </p>
              <h1 className="mt-1 font-sans text-3xl font-extrabold uppercase tracking-wider text-[#1a3a68]">
                Cyber Smart Girls Initiative 2026
              </h1>
              <h2 className="mt-0.5 font-sans text-2xl font-bold uppercase tracking-wider text-[#2e8b57]">
                Cyber Quiz Competition
              </h2>
            </div>

            {/* Logo Shield */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-14 items-center justify-center bg-linear-to-br from-red-600 via-emerald-600 to-green-600 p-1 text-xs font-bold text-white [clip-path:polygon(0_0,100%_0,100%_75%,50%_100%,0_75%)]">
                🛡️
              </div>
              <p className="mt-1 font-sans text-sm font-black tracking-tight text-[#8b0000]">
                TECH PUNNO
              </p>
              <p className="font-sans text-[8px] uppercase tracking-widest text-gray-500">
                SECURE. LEAD. GROW.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 my-2 px-16 text-center">
            <p className="mb-4 font-sans text-lg font-bold uppercase tracking-[0.2em] text-gray-700">
              This is to certify that
            </p>

            <h3 className="mb-6 font-serif text-4xl font-bold italic text-gray-900 underline decoration-1 decoration-gray-300 underline-offset-8 md:text-5xl">
              {name}
            </h3>

            <p className="mx-auto max-w-3xl font-sans text-base leading-relaxed text-gray-700">
              for successfully completing the{" "}
              <span className="font-semibold text-gray-900">
                TechPunno Cyber Awareness Quiz
              </span>
              {percentage !== undefined && (
                <>
                  {" "}
                  with an outstanding score of{" "}
                  <span className="font-semibold text-gray-900">
                    {percentage}%
                  </span>
                </>
              )}{" "}
              on {displayDate}
              {percentage !== undefined && (
                <>
                  . Certificate ID:{" "}
                  <span className="font-semibold text-gray-900">{certId}</span>
                </>
              )}
              .
            </p>
            <p className="mt-2 font-sans text-base text-gray-700">
              We wish {name.split(" ")[0]} all the best for future success.
            </p>
          </div>

          {/* Signatures & Award Seal */}
          <div className="relative z-10 flex justify-between px-16 pb-8 items-end">
            <div className="w-52 text-center">
              <div className="flex h-10 items-center justify-center font-serif text-lg font-bold italic text-gray-800">
                Mehedi
              </div>
              <div className="border-t border-gray-600 pt-1">
                <p className="font-sans text-sm font-bold uppercase tracking-wide text-[#1a3a68]">
                  Mehedi Hasan
                </p>
                <p className="font-sans text-xs text-gray-600">Founder</p>
              </div>
            </div>

            {/* Seal Ribbon */}
            <div className="relative flex flex-col items-center">
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-amber-400 via-yellow-300 to-amber-500 border-4 border-yellow-200 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-amber-600">
                  <div className="h-8 w-8 rounded-full bg-amber-400" />
                </div>
              </div>
              <div className="-mt-3 flex gap-1">
                <div className="h-8 w-4 bg-amber-500 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
                <div className="h-8 w-4 bg-amber-500 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
              </div>
            </div>

            <div className="w-52 text-center">
              <div className="flex h-10 items-center justify-center font-serif text-lg font-bold italic text-gray-800">
                Rajibul
              </div>
              <div className="border-t border-gray-600 pt-1">
                <p className="font-sans text-sm font-bold uppercase tracking-wide text-[#1a3a68]">
                  Rajibul Islam Imon
                </p>
                <p className="font-sans text-xs text-gray-600">
                  Event Coordinator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
