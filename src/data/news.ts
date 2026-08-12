export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  badge: "Hot" | "Update" | "Announcement";
  cardImage?: string;
  images?: string[];
  externalUrl?: string;
  slug?: string;
};

export const newsItems: NewsItem[] = [
  {
    id: "n0",
    title: "নতুন Android ম্যালওয়্যার PromptSpy — যা Google Gemini AI ব্যবহার করছে",
    summary:
      "সাইবারসিকিউরিটি গবেষকরা প্রথম পরিচিত Android ম্যালওয়্যার PromptSpy-এর সন্ধান পেয়েছেন, যা Google-এর Gemini AI-কে ব্যবহার করে ফোনের UI বিশ্লেষণ করে ঠিক কোন জায়গায় ট্যাপ বা সোয়াইপ করতে হবে তার নির্দেশ নেয়।",
    content:
      "<p>সাইবারসিকিউরিটি গবেষকরা এক নতুন ধরনের Android ম্যালওয়্যার আবিষ্কার করেছেন, যার নাম PromptSpy। এটাই প্রথম পরিচিত Android ম্যালওয়্যার যা সরাসরি Google-এর Gemini জেনারেটিভ AI মডেলকে নিজের কাজের অংশ হিসেবে ব্যবহার করছে।</p><p>PromptSpy হলো একটি অত্যাধুনিক Android ম্যালওয়্যার যা Gemini-কে ফোনের ইউজার ইন্টারফেস (UI)-এর তথ্য বিশ্লেষণ করতে ব্যবহার করে।</p><p><strong>কীভাবে কাজ করে?</strong></p><ul><li>ব্যবহারকারীকে রিক্রুট করতে এটি একটি ফিশিং-ধাঁচের অ্যাপের মাধ্যমে ইনস্টল হতে চায়।</li><li>ইনস্টল হওয়ার পর Gemini-র API-তে UI-এর তথ্য পাঠানো হয়।</li><li>Gemini-AI প্রতিবার UI-এর বিবরণ দেখে নির্দেশ দেয় কোন ফাংশনগুলো চালাতে হবে।</li></ul><p>নিরাপদ থাকতে অজানা উৎস থেকে অ্যাপ ইনস্টল করবেন না এবং Google Play Protect সবসময় চালু রাখুন।</p>",
    date: "2026-08-04",
    badge: "Hot",
    cardImage: "/images/news/news-1.jpeg",
    slug: "notun-android-malware-promptspy-gemini-ai",
  },
  {
    id: "n0b",
    title: "ফিশিং আক্রমণ থেকে বাঁচুন — সতর্ক থাকুন, নিরাপদ থাকুন",
    summary:
      "ফিশিং হলো সাইবার অপরাধীদের সবচেয়ে প্রচলিত কৌশল — ভুয়া ইমেইল, এসএমএস বা অ্যাপের মাধ্যমে ব্যক্তিগত তথ্য চুরি করা হয়।",
    content:
      "<p>ফিশিং হলো সাইবার অপরাধীদের সবচেয়ে প্রচলিত কৌশল — ভুয়া ইমেইল, এসএমএস, ফেক ওয়েবসাইট বা অ্যাপের মাধ্যমে ব্যক্তিগত তথ্য চুরি করা হয়।</p><p><strong>কীভাবে ফিশিং চেনা যায়?</strong></p><ul><li>জরুরি টোনে তথ্য চাওয়া হয়।</li><li>লিংকের ঠিকানা সামান্য ভিন্ন হয়।</li><li>ব্যাকরণ বা বানান ভুল থাকে।</li><li>অজানা নম্বর থেকে ওটিপি চাওয়া হয়।</li></ul><p><strong>নিরাপদ থাকার উপায়</strong></p><ul><li>অজানা লিংকে ক্লিক করবেন না।</li><li>ওটিপি বা পাসওয়ার্ড কখনো কারো সাথে শেয়ার করবেন না।</li><li>দুই-ধাপে যাচাই (2FA) সবসময় চালু রাখুন।</li></ul>",
    date: "2026-08-03",
    badge: "Update",
    cardImage: "/images/news/news-1.jpeg",
    slug: "phishing-akromon-theke-bachun",
  },
  {
    id: "n1",
    title: "TechPunno welcomes a fresh batch of volunteers",
    summary:
      "New volunteers joined the TechPunno family as part of our mission to boost cyber awareness and build a safe digital society.",
    content:
      "<p>New volunteers joined the TechPunno family as part of our mission to boost cyber awareness and build a safe digital society.</p>",
    date: "2026-07-15",
    badge: "Hot",
    slug: "techpunno-welcomes-fresh-batch-of-volunteers",
  },
  {
    id: "n2",
    title: "National Cyber Safety Campaign goes live",
    summary:
      "Our nationwide awareness drive is now active in schools and on social media, reaching thousands of students.",
    content:
      "<p>Our nationwide awareness drive is now active in schools and on social media, reaching thousands of students.</p>",
    date: "2026-07-02",
    badge: "Announcement",
    slug: "national-cyber-safety-campaign-goes-live",
  },
  {
    id: "n3",
    title: "Safe Digital Society Webinar recap is out",
    summary:
      "Missed the webinar? Read the full recap and highlights from our experts on privacy and misinformation.",
    content:
      "<p>Missed the webinar? Read the full recap and highlights from our experts on privacy and misinformation.</p>",
    date: "2026-06-20",
    badge: "Update",
    slug: "safe-digital-society-webinar-recap",
  },
  {
    id: "n4",
    title: "Volunteer onboarding registration now open",
    summary:
      "Interested in volunteering? Onboarding for the next cohort is now open — sign up through the contact form.",
    content:
      "<p>Interested in volunteering? Onboarding for the next cohort is now open — sign up through the contact form.</p>",
    date: "2026-06-10",
    badge: "Announcement",
    slug: "volunteer-onboarding-registration-open",
  },
];
