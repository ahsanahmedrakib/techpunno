"use client";

import { site } from "@/data/site";
import { Download } from "lucide-react";
import { Lobster } from "next/font/google";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
});

interface CertificateProps {
  name?: string;
  percentage?: number;
  phone?: string;
  date?: string;
  embed?: boolean;
  certificateId?: string;
  certificateUrl?: string;
}

export default function Certificate({
  name = "Suraiya Islam Labonno",
  percentage,
  phone = "",
  date,
  embed = false,
  certificateId,
  certificateUrl,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const qrValue = certificateUrl ?? "";

  const displayDate =
    date ||
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  function generateCertificateId(phone: string): string {
    const map = "ABCDEFGHIJ";

    const encoded = phone
      .replace(/\D/g, "")
      .replace(/[0-9]/g, (digit) => map[Number(digit)]);

    const year = new Date().getFullYear().toString().slice(-2);

    return `${year}-${encoded}`;
  }

  const displayCertificateId = certificateId || generateCertificateId(phone);

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    const html2canvas = (await import("html2canvas-pro")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#f8f9f2",
    });

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "landscape",
      compress: true,
    });

    const pageWidth = 297;
    const pageHeight = 210;
    const imgWidth = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.98),
      "JPEG",
      0,
      (pageHeight - imgHeight) / 2,
      imgWidth,
      imgHeight,
    );

    pdf.save(`Certificate_${name.trim().replace(/\s+/g, "_") || "Quiz"}.pdf`);
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
      <div className="mb-6 mt-16 flex gap-4 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="cursor-pointer flex gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-sans font-medium text-white shadow-md transition hover:bg-emerald-800"
        >
          <span> Download PDF</span>
          <Download />
        </button>
      </div>

      {/* Certificate Frame - Using max-w-262.5 (1050px) */}
      <div className="w-full max-w-262.5 overflow-x-auto rounded-sm shadow-2xl print:shadow-none print:m-0 print:p-0">
        <div
          ref={certificateRef}
          id="certificate-print"
          className="certificate-texture relative box-border flex h-185.5 w-262.5 flex-col justify-between border-3 border-white p-8 text-gray-800 select-none print:h-[210mm] print:w-[297mm] print:border-none"
        >
          {/* Top Decorative Shapes */}
          <div className="absolute top-0 left-0 h-8 w-96 bg-[#1a3a68] [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]" />
          <div className="absolute top-0 right-0 h-2 w-[45%] bg-[#f0a828]" />

          {/* Left Top | Decorative Bars */}
          <div className="absolute top-7 left-0 h-80 w-8 bg-[#1a3a68] [clip-path:polygon(0_0,100%_0,100%_88%,0_100%)]" />
          {/* Right Bottom | Decorative Bars */}
          <div className="absolute top-82 right-0 h-96 w-8 bg-[#1a3a68] [clip-path:polygon(0_12%,100%_0,100%_100%,0_100%)]" />

          {/* Bottom Decorative Shapes */}
          <div className="absolute right-0 bottom-0 h-8 w-96 bg-[#1a3a68] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]" />
          <div className="absolute bottom-0 left-0 h-2 w-[45%] bg-[#f0a828]" />

          {qrValue && (
            <div className="absolute flex w-28 flex-col items-center top-5 right-1">
              <div className="border-2 border-[#1a3a68]/30 bg-white p-2 shadow-sm">
                <QRCodeCanvas
                  value={qrValue}
                  size={76}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#1a3a68"
                />
              </div>
              <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-wide text-gray-600">
                Scan to verify
              </p>
            </div>
          )}
          {/* Header Section */}
          <div className="relative z-10 flex flex-col justify-center items-center overflow-hidden">
            {/* Logo Shield */}
            <div className="flex flex-col items-center">
              <Image
                src={site.logo}
                alt={`${site.name} logo`}
                height={300}
                width={120}
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="text-center mt-3">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gray-700">
                Tech Punno Presents
              </p>
              <h1
                style={{ fontWeight: 800 }}
                className={`${lobster.className} mt-1 text-5xl font-extrabold uppercase leading-16 tracking-widest text-[#1a3a68]`}
              >
                Cyber Smart Girls Initiative 2026
              </h1>
              <h2
                style={{ fontWeight: 700 }}
                className={`${lobster.className} mt-1 text-4xl font-bold uppercase tracking-widest text-[#2e8b57]`}
              >
                Cyber Quiz Competition
              </h2>
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
                  <span className="font-semibold text-gray-900">
                    {displayCertificateId}
                  </span>
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
              <div className="flex flex-col items-center">
                <Image
                  src={"/images/certificate/sign-1.png"}
                  alt={`Sign-1`}
                  height={300}
                  width={120}
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="border-t border-gray-600 pt-1">
                <p className="font-sans text-lg font-bold uppercase tracking-wide text-[#1a3a68]">
                  Mehedi Hasan
                </p>
                <p className="font-sans text-sm text-gray-600">Founder</p>
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
              <div className="flex flex-col items-center">
                <Image
                  src={"/images/certificate/sign-2.png"}
                  alt={`Sign-2`}
                  height={300}
                  width={120}
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="border-t border-gray-600 pt-1">
                <p className="font-sans text-lg font-bold uppercase tracking-wide text-[#1a3a68]">
                  Rajibul Islam Imon
                </p>
                <p className="font-sans text-sm text-gray-600">
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
