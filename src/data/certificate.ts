export interface CertificateConfig {
  eventTitle: string;
  eventSubtitle: string;
  certifyText: string;
  quizTitle: string;
  wishText: string;
  signatoryName: string;
  signatoryRole: string;
  signatoryImage: string;
  sealTopText: string;
  sealBottomText: string;
  qrLabel: string;
}

export const defaultCertificateConfig: CertificateConfig = {
  eventTitle: "Cyber Smart Girls Initiative 2026",
  eventSubtitle: "Cyber Quiz Competition",
  certifyText: "This is to certify that",
  quizTitle: "TechPunno Cyber Awareness Quiz",
  wishText: "We wish {name} all the best for future success.",
  signatoryName: "Mehedi Hasan",
  signatoryRole: "Founder",
  signatoryImage: "/images/certificate/sign-1.png",
  sealTopText: "TECH PUNNO",
  sealBottomText: "CYBER QUIZ 2026",
  qrLabel: "Scan to verify",
};
