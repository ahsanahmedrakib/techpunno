import AdvisorTeam from "@/components/sections/AdvisorTeam";
import Blogs from "@/components/sections/Blogs";
import Contact from "@/components/sections/Contact";
import CoreTeam from "@/components/sections/CoreTeam";
import Courses from "@/components/sections/Courses";
import Events from "@/components/sections/Events";
import Hero from "@/components/sections/Hero";
import News from "@/components/sections/News";
import Testimonials from "@/components/sections/Testimonials";
import VideoSection from "@/components/sections/VideoSection";

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
