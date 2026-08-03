export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "শক্তিশালী পাসওয়ার্ডের সবচেয়ে গুরুত্বপূর্ণ বৈশিষ্ট্য কোনটি?",
    options: [
      "শুধু নিজের নাম ব্যবহার করা",
      "শুধু জন্মতারিখ ব্যবহার করা",
      "বড়-ছোট হাতের অক্ষর, সংখ্যা ও বিশেষ চিহ্নের সমন্বয় করা",
      "শুধু মোবাইল নম্বর ব্যবহার করা",
    ],
    correctIndex: 2,
  },
  {
    id: 2,
    question: '"ফিশিং (Phishing)" বলতে কী বোঝায়?',
    options: [
      "মাছ ধরা",
      "ভুয়া ওয়েবসাইট বা ইমেইলের মাধ্যমে তথ্য চুরি করা",
      "মোবাইল চার্জ দেওয়া",
      "কম্পিউটার পরিষ্কার করা",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "নিচের কোনটি Two-Factor Authentication (2FA)-এর একটি উদাহরণ?",
    options: [
      "শুধু পাসওয়ার্ড ব্যবহার করা",
      "পাসওয়ার্ডের পাশাপাশি OTP ব্যবহার করা",
      "একই পাসওয়ার্ড সব জায়গায় ব্যবহার করা",
      "ব্রাউজারের হিস্ট্রি মুছে ফেলা",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: '"Deepfake" কী?',
    options: [
      "কম্পিউটারের নতুন অপারেটিং সিস্টেম",
      "AI ব্যবহার করে তৈরি ভুয়া ছবি, ভিডিও বা অডিও",
      "একটি অ্যান্টিভাইরাস সফটওয়্যার",
      "একটি ওয়েব ব্রাউজার",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "নিচের কোনটি সামাজিক যোগাযোগমাধ্যমে সবচেয়ে নিরাপদ অভ্যাস?",
    options: [
      "সবাইকে Friend Request গ্রহণ করা",
      "OTP অন্যের সাথে শেয়ার করা",
      "Privacy Settings ব্যবহার করা এবং অপরিচিত লিংকে ক্লিক না করা",
      "একই পাসওয়ার্ড সব অ্যাকাউন্টে ব্যবহার করা",
    ],
    correctIndex: 2,
  },
  {
    id: 6,
    question: "What does VPN stand for?",
    options: [
      "Virtual Private Network",
      "Very Personal Network",
      "Visual Public Network",
      "Virtual Password Number",
    ],
    correctIndex: 0,
  },
  {
    id: 7,
    question:
      "Which of the following is considered Personally Identifiable Information (PII)?",
    options: [
      "Favorite color",
      "National ID Number",
      "Weather forecast",
      "Mobile phone brand",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question:
      "What is the safest action if you receive an unexpected email asking for your password?",
    options: [
      "Reply with your password",
      "Click the link immediately",
      "Ignore or verify the sender before taking any action",
      "Forward it to friends",
    ],
    correctIndex: 2,
  },
  {
    id: 9,
    question:
      "Which device is primarily used to connect multiple computers within the same Local Area Network (LAN)?",
    options: ["Monitor", "Switch", "Printer", "Scanner"],
    correctIndex: 1,
  },
  {
    id: 10,
    question: "Which protocol is commonly used for secure web browsing?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctIndex: 2,
  },
];

export const quizDurationSeconds = 10 * 60;
