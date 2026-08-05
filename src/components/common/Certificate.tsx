"use client";

import { site } from "@/data/site";
import { Download } from "lucide-react";
import { Lobster } from "next/font/google";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { useId, useMemo, useRef } from "react";

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
});

function cogPoints(
  cx: number,
  cy: number,
  teeth: number,
  outer: number,
  inner: number,
): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / teeth) * i - Math.PI / 2;
    pts.push(
      `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  return pts.join(" ");
}

function starPoints(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
): string {
  const pts: string[] = [];
  const rot = -Math.PI / 2;
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rot + i * (Math.PI / 5);
    pts.push(
      `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  return pts.join(" ");
}

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
  const sealId = useId().replace(/[^a-zA-Z0-9]/g, "");

  const laurelLeaves = useMemo(() => {
    const leaves: { cx: number; cy: number; angle: number }[] = [];
    const branch = (fromDeg: number, toDeg: number) => {
      const steps = 6;
      for (let i = 0; i < steps; i++) {
        const deg = fromDeg + ((toDeg - fromDeg) * (i + 0.5)) / steps;
        const rad = (deg * Math.PI) / 180;
        leaves.push({
          cx: 50 + 36 * Math.cos(rad),
          cy: 50 + 36 * Math.sin(rad),
          angle: deg,
        });
      }
    };
    branch(150, 95);
    branch(30, 85);
    return leaves;
  }, []);

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

            {/* Award Seal */}
            <div className="relative flex flex-col items-center">
              <div className="relative z-10 flex h-24 w-24 items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full drop-shadow-lg"
                >
                  <defs>
                    <radialGradient
                      id={`${sealId}-body`}
                      cx="38%"
                      cy="32%"
                      r="80%"
                    >
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="40%" stopColor="#f5c542" />
                      <stop offset="72%" stopColor="#d9991f" />
                      <stop offset="100%" stopColor="#8a5d0e" />
                    </radialGradient>
                    <radialGradient
                      id={`${sealId}-center`}
                      cx="40%"
                      cy="34%"
                      r="85%"
                    >
                      <stop offset="0%" stopColor="#fffbe8" />
                      <stop offset="60%" stopColor="#f5c542" />
                      <stop offset="100%" stopColor="#c98f1c" />
                    </radialGradient>
                    <path
                      id={`${sealId}-arcTop`}
                      d="M 25,50 A 25,25 0 0 1 75,50"
                    />
                    <path
                      id={`${sealId}-arcBottom`}
                      d="M 75,50 A 25,25 0 0 1 25,50"
                    />
                  </defs>

                  <polygon
                    points={cogPoints(50, 50, 36, 48.5, 44)}
                    fill="#7c4a03"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44.5"
                    fill={`url(#${sealId}-body)`}
                    stroke="#fde68a"
                    strokeOpacity="0.9"
                    strokeWidth="0.8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="41.5"
                    fill="none"
                    stroke="#8a5d0e"
                    strokeOpacity="0.35"
                    strokeWidth="0.9"
                  />

                  <path
                    d="M 50,83 A 33,33 0 0 1 21.4,66.5"
                    fill="none"
                    stroke="#8a5d0e"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 50,83 A 33,33 0 0 0 78.6,66.5"
                    fill="none"
                    stroke="#8a5d0e"
                    strokeWidth="1.5"
                  />
                  {laurelLeaves.map((leaf, i) => (
                    <ellipse
                      key={i}
                      cx={leaf.cx}
                      cy={leaf.cy}
                      rx="2.4"
                      ry="6"
                      fill="#8a5d0e"
                      opacity="0.95"
                      transform={`rotate(${leaf.angle - 90} ${leaf.cx} ${leaf.cy})`}
                    />
                  ))}

                  <text
                    fill="#7c4a03"
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    <textPath
                      href={`#${sealId}-arcTop`}
                      startOffset="7.3"
                      textLength="64"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      TECH PUNNO
                    </textPath>
                  </text>
                  <text
                    fill="#7c4a03"
                    fontSize="6.5"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    <textPath
                      href={`#${sealId}-arcBottom`}
                      startOffset="7.3"
                      textLength="64"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      CYBER QUIZ 2026
                    </textPath>
                  </text>

                  <circle
                    cx="50"
                    cy="50"
                    r="17.5"
                    fill={`url(#${sealId}-center)`}
                    stroke="#8a5d0e"
                    strokeOpacity="0.4"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points={starPoints(50, 50, 12, 5.2)}
                    fill="#1a3a68"
                  />
                </svg>
              </div>
              <div className="pointer-events-none absolute top-[3.4rem] flex w-14 justify-center">
                <div className="h-9 w-4.5 rounded-b-sm bg-linear-to-b from-amber-500 to-amber-800 shadow-sm [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
                <div className="-ml-px h-9 w-4.5 rounded-b-sm bg-linear-to-b from-amber-600 to-amber-900 shadow-sm [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
              </div>
            </div>

            <div className="w-52 text-center invisible">
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
          </div>
        </div>
      </div>
    </div>
  );
}
