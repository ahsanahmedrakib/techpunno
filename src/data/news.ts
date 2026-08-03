export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string[];
  date: string;
  badge: "Hot" | "Update" | "Announcement";
  image?: string;
};

export const newsItems: NewsItem[] = [
  {
    id: "n0",
    title: "নতুন Android ম্যালওয়্যার PromptSpy — যা Google Gemini AI ব্যবহার করছে",
    summary:
      "সাইবারসিকিউরিটি গবেষকরা প্রথম পরিচিত Android ম্যালওয়্যার PromptSpy-এর সন্ধান পেয়েছেন, যা Google-এর Gemini AI-কে ব্যবহার করে ফোনের UI বিশ্লেষণ করে ঠিক কোন জায়গায় ট্যাপ বা সোয়াইপ করতে হবে তার নির্দেশ নেয়। এটি নিজেকে Recent Apps-এ লক রাখে, যাতে ব্যবহারকারী সহজে বন্ধ করতে না পারে। নিরাপদ থাকতে অজানা উৎস থেকে অ্যাপ ইনস্টল করবেন না এবং Google Play Protect সবসময় চালু রাখুন।",
    content: [
      "সাইবারসিকিউরিটি গবেষকরা এক নতুন ধরনের Android ম্যালওয়্যার আবিষ্কার করেছেন, যার নাম PromptSpy। এটাই প্রথম পরিচিত Android ম্যালওয়্যার যা সরাসরি Google-এর Gemini জেনারেটিভ AI মডেলকে নিজের কাজের অংশ হিসেবে ব্যবহার করছে।",
      "PromptSpy হলো একটি অত্যাধুনিক Android ম্যালওয়্যার যা Gemini-কে ফোনের ইউজার ইন্টারফেস (UI)-এর তথ্য বিশ্লেষণ করতে ব্যবহার করে এবং ঠিক কোন জায়গায় ট্যাপ বা সোয়াইপ করতে হবে তা AI-এর কাছ থেকে নির্দেশ পায়। এতে করে ম্যালওয়্যারটি নিজেকে Recent Apps তালিকায় লক করে, যাতে ব্যবহারকারী সহজে বন্ধ করতে না পারে।",
      "কীভাবে কাজ করে এই PromptSpy?\n\n- ব্যবহারকারীকে রিক্রুট করতে এটি একটি ফিশিং-ধাঁচের অ্যাপের মাধ্যমে ইনস্টল হতে চায়।\n- ইনস্টল হওয়ার পর Gemini-র API-তে UI-এর তথ্য পাঠানো হয়।\n- Gemini-AI প্রতিবার UI-এর বিবরণ দেখে নির্দেশ দেয় কোন ফাংশনগুলো চালাতে হবে।\n- এতে ম্যালওয়্যার নিজেকে 'রিসেন্ট অ্যাপস'-এ ধরে রাখতে পারে, যেটা সাধারণভাবে বন্ধ করা কঠিন।\n- একবার স্থায়ীভাবে সক্রিয় হলে এতে VNC-ভিত্তিক রিমোট এক্সেস এবং স্ক্রিন-রেকর্ডিং/লকস্ক্রিন তথ্য-চুরি মতো ফিচারও থাকতে পারে।",
      "এটা কতটা বিপজ্জনক?\n\n- Gemini-এর মাধ্যমে UI-এ কী চলছে তা পড়ে নির্দেশ গ্রহণ করায় ম্যালওয়্যারটি ফোনের বিভিন্ন স্ক্রিন/মডেল অনুযায়ী সহজেই খাপ খাইয়ে নিতে পারে।\n- স্বাভাবিক সেন্সর বা নির্দিষ্ট কো-অর্ডিনেট ছাড়াই এটি কাজ করতে পারে, ফলে প্রচলিত প্রতিরোধ পদ্ধতিতে ধরা কঠিন।\n- এমন AI-সহিত ম্যালওয়্যার প্রথমবারের মতো খুঁজে পাওয়া গেছে, যা ভিন্ন ধরনের সাইবারহুমকি সূচিত করছে।",
      "যেভাবে নিরাপদ থাকা যায়?\n\n- অজানা উৎস থেকে অ্যাপ ইনস্টল করবেন না।\n- সবসময় Google Play Protect চালু রাখুন।\n- অস্বাভাবিক পারমিশন চাইলে সতর্ক থাকুন।\n- ফোনের সিকিউরিটি অ্যাপ ইনস্টল করে নিয়মিত স্ক্যান করুন।",
      "Tech Punno এর সাথে থাকুন, নিরাপদ থাকুন।",
    ],
    date: "Aug 04, 2026",
    badge: "Hot",
    image: "/images/news/news-1.jpeg",
  },
  {
    id: "n0b",
    title: "ফিশিং আক্রমণ থেকে বাঁচুন — সতর্ক থাকুন, নিরাপদ থাকুন",
    summary:
      "ফিশিং হলো সাইবার অপরাধীদের সবচেয়ে প্রচলিত কৌশল — ভুয়া ইমেইল, এসএমএস বা অ্যাপের মাধ্যমে ব্যক্তিগত তথ্য চুরি করা হয়। অজানা লিংকে ক্লিক করবেন না, ওটিপি বা পাসওয়ার্ড কাউকে দেবেন না এবং দুই-ধাপে যাচাই (2FA) সবসময় চালু রাখুন। সন্দেহজনক কিছু পেলে বিশ্বস্ত উৎসে যাচাই করুন। Tech Punno এর সাথে থাকুন, নিরাপদ থাকুন।",
    content: [
      "ফিশিং হলো সাইবার অপরাধীদের সবচেয়ে প্রচলিত কৌশল — ভুয়া ইমেইল, এসএমএস, ফেক ওয়েবসাইট বা অ্যাপের মাধ্যমে ব্যক্তিগত তথ্য চুরি করা হয়। আক্রমণকারীরা বিশ্বস্ত প্রতিষ্ঠানের মতো দেখতে মেসেজ পাঠিয়ে ব্যবহারকারীদের লগইন তথ্য, পাসওয়ার্ড বা ওটিপি দিতে বাধ্য করে।",
      "কীভাবে ফিশিং চেনা যায়?\n\n- জরুরি টোনে তথ্য চাওয়া হয় (যেমন 'আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে')।\n- লিংকের ঠিকানা সামান্য ভিন্ন হয় (যেমন techpunno.org-এর বদলে techpunno-verify.xyz)।\n- ব্যাকরণ বা বানান ভুল থাকে।\n- অজানা নম্বর থেকে ওটিপি চাওয়া হয়।",
      "নিরাপদ থাকার উপায়\n\n- অজানা লিংকে ক্লিক করবেন না, সন্দেহ হলে সরাসরি অফিসিয়াল অ্যাপ বা ওয়েবসাইটে যান।\n- ওটিপি বা পাসওয়ার্ড কখনো কারো সাথে শেয়ার করবেন না।\n- দুই-ধাপে যাচাই (2FA) সবসময় চালু রাখুন।\n- কোনো তথ্য দেওয়ার আগে বিশ্বস্ত উৎসে যাচাই করুন।",
      "Tech Punno এর সাথে থাকুন, নিরাপদ থাকুন।",
    ],
    date: "Aug 03, 2026",
    badge: "Update",
    image: "/images/news/news-1.jpeg",
  },
  {
    id: "n1",
    title: "TechPunno welcomes a fresh batch of volunteers",
    summary:
      "New volunteers joined the TechPunno family as part of our mission to boost cyber awareness and build a safe digital society.",
    content: [
      "New volunteers joined the TechPunno family as part of our mission to boost cyber awareness and build a safe digital society.",
    ],
    date: "Jul 15, 2026",
    badge: "Hot",
  },
  {
    id: "n2",
    title: "National Cyber Safety Campaign goes live",
    summary:
      "Our nationwide awareness drive is now active in schools and on social media, reaching thousands of students.",
    content: [
      "Our nationwide awareness drive is now active in schools and on social media, reaching thousands of students.",
    ],
    date: "Jul 02, 2026",
    badge: "Announcement",
  },
  {
    id: "n3",
    title: "Safe Digital Society Webinar recap is out",
    summary:
      "Missed the webinar? Read the full recap and highlights from our experts on privacy and misinformation.",
    content: [
      "Missed the webinar? Read the full recap and highlights from our experts on privacy and misinformation.",
    ],
    date: "Jun 20, 2026",
    badge: "Update",
  },
  {
    id: "n4",
    title: "Volunteer onboarding registration now open",
    summary:
      "Interested in volunteering? Onboarding for the next cohort is now open — sign up through the contact form.",
    content: [
      "Interested in volunteering? Onboarding for the next cohort is now open — sign up through the contact form.",
    ],
    date: "Jun 10, 2026",
    badge: "Announcement",
  },
];
