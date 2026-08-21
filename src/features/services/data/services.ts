export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceProcess {
  step: number;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  charge: string;
  slug: string;
  fullDescription: string;
  features: ServiceFeature[];
  process: ServiceProcess[];
  whoItsFor: string[];
  faqs: { question: string; answer: string }[];
}

export const services: Service[] = [
  {
    id: "svc-1",
    title: "Social Media Account Recovery",
    icon: "🔐",
    description:
      "Facebook & Instagram account recovery assistance. We help you regain access to your compromised or locked social media accounts.",
    charge: "আলোচনা সাপেক্ষে",
    slug: "social-media-account-recovery",
    fullDescription: `Losing access to your social media account can be stressful — especially when it holds years of memories, personal connections, or business content. At TechPunno, we specialize in helping individuals and organizations recover their compromised, hacked, or locked Facebook and Instagram accounts.

Our team uses proven recovery methods and stays up-to-date with the latest platform policies to maximize your chances of regaining access. Whether your account was hacked, disabled, or locked due to suspicious activity, we guide you through every step of the recovery process.

We also provide post-recovery security hardening to ensure your account stays safe going forward — including two-factor authentication setup, session review, and privacy audit.`,
    features: [
      {
        title: "Hacked Account Recovery",
        description:
          "Regain access to accounts that have been taken over by unauthorized parties.",
      },
      {
        title: "Disabled Account Appeal",
        description:
          "Professional appeal drafting and submission for disabled or restricted accounts.",
      },
      {
        title: "Two-Factor Authentication Setup",
        description:
          "Secure your recovered account with proper 2FA and login alerts.",
      },
      {
        title: "Privacy & Security Audit",
        description:
          "Full review of your account settings to prevent future breaches.",
      },
      {
        title: "Business Account Recovery",
        description:
          "Specialized recovery for Facebook Business Manager and Instagram professional accounts.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Initial Assessment",
        description:
          "Share your account situation with us. We review the issue and determine the best recovery approach.",
      },
      {
        step: 2,
        title: "Recovery Strategy",
        description:
          "We develop a tailored recovery plan based on your specific case — whether it's a hack, lock, or disable.",
      },
      {
        step: 3,
        title: "Execution & Appeal",
        description:
          "Our team executes the recovery process, submits appeals, and follows up with platform support.",
      },
      {
        step: 4,
        title: "Security Hardening",
        description:
          "Once recovered, we secure your account with 2FA, session cleanup, and privacy review.",
      },
    ],
    whoItsFor: [
      "Individuals whose Facebook or Instagram was hacked",
      "Users with disabled or restricted accounts",
      "Businesses locked out of their business pages",
      "Anyone who lost access due to forgotten credentials",
      "Accounts flagged by platform security systems",
    ],
    faqs: [
      {
        question: "Which platforms do you support?",
        answer:
          "We currently specialize in Facebook and Instagram account recovery. Support for other platforms may be available on request.",
      },
      {
        question: "How long does recovery take?",
        answer:
          "Recovery time varies depending on the case complexity. Simple cases may resolve in 1-3 days, while complex appeals can take 1-2 weeks.",
      },
      {
        question: "Do you guarantee recovery?",
        answer:
          "While we use proven methods and have a high success rate, we cannot guarantee recovery as final decisions rest with the platform. We'll be transparent about your chances during the initial assessment.",
      },
    ],
  },
  {
    id: "svc-2",
    title: "Web Design & Development",
    icon: "💻",
    description:
      "Modern, responsive and professional websites. From landing pages to full-stack applications, we build digital experiences that work.",
    charge: "আলোচনা সাপেক্ষে",
    slug: "web-design-development",
    fullDescription: `In today's digital world, your website is often the first impression you make. TechPunno delivers modern, fast, and responsive websites that not only look great but also perform flawlessly across all devices.

From sleek landing pages to complex full-stack web applications, our development team combines clean design with robust engineering. We use the latest technologies and follow industry best practices to build sites that are accessible, SEO-friendly, and easy to maintain.

Whether you need a corporate website, an e-commerce platform, a portfolio, or a custom web application, we bring your vision to life with attention to detail and a commitment to quality.`,
    features: [
      {
        title: "Responsive Design",
        description:
          "Websites that look and work perfectly on desktops, tablets, and mobile devices.",
      },
      {
        title: "Modern Tech Stack",
        description:
          "Built with Next.js, React, Tailwind CSS, and other cutting-edge technologies.",
      },
      {
        title: "SEO Optimized",
        description:
          "Clean code structure and meta optimization to help you rank higher on search engines.",
      },
      {
        title: "Performance Focused",
        description:
          "Lightning-fast load times with optimized images, lazy loading, and efficient code.",
      },
      {
        title: "Custom Functionality",
        description:
          "Contact forms, admin panels, e-commerce — whatever your project needs.",
      },
      {
        title: "Ongoing Support",
        description:
          "Post-launch maintenance, updates, and technical support to keep your site running smoothly.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Planning",
        description:
          "We discuss your goals, target audience, and requirements to create a clear project roadmap.",
      },
      {
        step: 2,
        title: "Design & Prototyping",
        description:
          "Our designers create wireframes and visual mockups for your approval before development begins.",
      },
      {
        step: 3,
        title: "Development",
        description:
          "Clean, efficient code is written with regular updates so you can track progress.",
      },
      {
        step: 4,
        title: "Testing & Launch",
        description:
          "Rigorous testing across devices and browsers, followed by a smooth deployment.",
      },
    ],
    whoItsFor: [
      "Small businesses needing an online presence",
      "Startups building their first website",
      "Organizations redesigning outdated sites",
      "E-commerce businesses launching online stores",
      "Individuals building personal portfolios",
    ],
    faqs: [
      {
        question: "What technologies do you use?",
        answer:
          "We primarily use Next.js, React, TypeScript, and Tailwind CSS for frontend. For backend, we use Node.js with MongoDB. We choose the best stack based on your project needs.",
      },
      {
        question: "How much does a website cost?",
        answer:
          "Pricing depends on complexity, features, and timeline. Contact us with your requirements for a detailed quote. We offer competitive rates for quality work.",
      },
      {
        question: "Do you provide hosting?",
        answer:
          "We can help you set up hosting on Vercel, Netlify, or your preferred provider. We also assist with domain registration and DNS configuration.",
      },
    ],
  },
  {
    id: "svc-3",
    title: "OSINT",
    icon: "🔎",
    description:
      "Open-source information research and analysis. We use publicly available data to gather actionable intelligence.",
    charge: "আলোচনা সাপেক্ষে",
    slug: "osint",
    fullDescription: `Open Source Intelligence (OSINT) is the practice of collecting and analyzing information from publicly available sources to produce actionable intelligence. At TechPunno, we leverage OSINT techniques to help individuals, businesses, and organizations uncover insights that would otherwise remain hidden.

Our OSINT services are used for due diligence investigations, background verification, brand monitoring, threat intelligence, and digital forensics. We combine manual research skills with automated tools to deliver comprehensive intelligence reports.

All our OSINT work is conducted ethically and legally, using only publicly available information. We never engage in unauthorized access or any activity that violates privacy laws.`,
    features: [
      {
        title: "Background Verification",
        description:
          "Verify individuals or organizations using publicly available digital footprints.",
      },
      {
        title: "Brand Monitoring",
        description:
          "Track mentions, sentiment, and potential threats to your brand across the internet.",
      },
      {
        title: "Due Diligence Research",
        description:
          "Comprehensive research on business partners, investments, or acquisition targets.",
      },
      {
        title: "Threat Intelligence",
        description:
          "Identify potential cybersecurity threats and vulnerabilities from open sources.",
      },
      {
        title: "Digital Footprint Analysis",
        description:
          "Map out an individual's or organization's online presence and activities.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Scope Definition",
        description:
          "We define the research objectives, targets, and ethical boundaries of the investigation.",
      },
      {
        step: 2,
        title: "Data Collection",
        description:
          "Systematic collection of publicly available information from diverse open sources.",
      },
      {
        step: 3,
        title: "Analysis & Correlation",
        description:
          "Data is analyzed, cross-referenced, and correlated to extract meaningful intelligence.",
      },
      {
        step: 4,
        title: "Intelligence Report",
        description:
          "A clear, actionable report with findings, visualizations, and recommendations.",
      },
    ],
    whoItsFor: [
      "Businesses conducting due diligence on partners",
      "Individuals verifying someone's background",
      "Organizations monitoring brand reputation",
      "Security teams gathering threat intelligence",
      "Legal teams needing digital evidence",
    ],
    faqs: [
      {
        question: "Is OSINT legal?",
        answer:
          "Yes. OSINT exclusively uses publicly available information — data that anyone can legally access. We never hack, breach, or access private systems.",
      },
      {
        question: "What sources do you use?",
        answer:
          "We use a wide range of open sources including social media, public records, search engines, news outlets, government databases, forums, and specialized OSINT tools.",
      },
      {
        question: "How long does an investigation take?",
        answer:
          "Simple research tasks can be completed in 1-2 days. Complex investigations with deep analysis may take 1-2 weeks depending on scope.",
      },
    ],
  },
  {
    id: "svc-4",
    title: "Cyber Security Consultation",
    icon: "🛡️",
    description:
      "Practical cybersecurity guidance and solutions. Protect your digital assets with expert advice and implementation.",
    charge: "আলোচনা সাপেক্ষে",
    slug: "cyber-security-consultation",
    fullDescription: `Cyber threats are evolving every day, and both individuals and organizations need proactive security measures to stay safe. TechPunno offers practical, no-nonsense cybersecurity consultations tailored to your specific needs and risk profile.

Our consultation services cover everything from personal device security to organizational security policy development. We focus on real-world, actionable advice rather than theoretical jargon — helping you understand your risks and implement effective protections.

Whether you're a small business looking to secure your operations, an individual concerned about personal privacy, or an organization needing a comprehensive security audit, our team is ready to help.`,
    features: [
      {
        title: "Security Assessment",
        description:
          "Comprehensive evaluation of your current security posture and identification of vulnerabilities.",
      },
      {
        title: "Personal Security Audit",
        description:
          "Review of your personal devices, accounts, and online privacy settings.",
      },
      {
        title: "Business Security Policy",
        description:
          "Development of security policies and procedures tailored to your organization.",
      },
      {
        title: "Incident Response Planning",
        description:
          "Prepare a clear action plan for what to do when a security breach occurs.",
      },
      {
        title: "Security Awareness Training",
        description:
          "Interactive training sessions to teach your team how to recognize and avoid threats.",
      },
      {
        title: "Tool & Software Recommendations",
        description:
          "Expert guidance on choosing the right security tools for your needs and budget.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Initial Consultation",
        description:
          "We discuss your concerns, environment, and goals to understand your security needs.",
      },
      {
        step: 2,
        title: "Assessment & Audit",
        description:
          "Thorough evaluation of your systems, practices, and policies to identify risks.",
      },
      {
        step: 3,
        title: "Recommendations & Roadmap",
        description:
          "Clear, prioritized recommendations with a step-by-step implementation plan.",
      },
      {
        step: 4,
        title: "Implementation Support",
        description:
          "Hands-on help implementing the recommended security measures and training your team.",
      },
    ],
    whoItsFor: [
      "Small to medium businesses without a dedicated IT security team",
      "Individuals concerned about personal digital security",
      "Organizations preparing for compliance requirements",
      "Teams that have experienced a security incident",
      "Anyone wanting to improve their cyber hygiene",
    ],
    faqs: [
      {
        question: "Do I need cybersecurity consultation?",
        answer:
          "If you use the internet, have social media accounts, or run a business online, you can benefit from a security consultation. Cyber threats affect everyone, not just large corporations.",
      },
      {
        question: "Is this suitable for non-technical people?",
        answer:
          "Absolutely. Our consultations are designed to be accessible. We explain everything in plain language and provide step-by-step guidance that anyone can follow.",
      },
      {
        question: "Do you offer ongoing support?",
        answer:
          "Yes. We offer one-time consultations as well as ongoing security support packages. We can establish a regular review schedule to keep your security up-to-date.",
      },
    ],
  },
];
