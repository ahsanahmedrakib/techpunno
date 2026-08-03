import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Quiz from "@/components/sections/Quiz";

export const metadata: Metadata = {
  title: "Cyber Awareness Quiz — TechPunno",
  description:
    "Test your cyber security knowledge with the TechPunno quiz. Answer within 10 minutes and see your score.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-mist">
        <Quiz />
      </main>
      <Footer />
    </>
  );
}
