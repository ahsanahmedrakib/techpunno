import AdvisorTeam from "@/features/team/components/AdvisorTeam";
import Blogs from "@/features/blogs/components/Blogs";
import Contact from "@/features/contact/components/Contact";
import CoreTeam from "@/features/team/components/CoreTeam";
import Courses from "@/features/courses/components/Courses";
import Events from "@/features/events/components/Events";
import Hero from "@/features/home/components/Hero";
import News from "@/features/news/components/News";
import Testimonials from "@/features/home/components/Testimonials";
import VideoSection from "@/features/home/components/VideoSection";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <VideoSection />
      <Courses />
      <Events />
      <Blogs />
      <News />
      <Testimonials />
      <AdvisorTeam />
      <CoreTeam />
      <Contact />
    </main>
  );
}
