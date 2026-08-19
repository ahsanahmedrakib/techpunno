import type { Metadata } from "next";
import Quiz from "@/features/quiz/components/Quiz";

export const metadata: Metadata = {
  title: "Cyber Awareness Quiz — TechPunno",
  description:
    "Test your cyber security knowledge with the TechPunno quiz. Answer within 10 minutes and see your score.",
};

export default function QuizPage() {
  return (
    <main className="flex-1 bg-mist">
      <Quiz />
    </main>
  );
}
