import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import Hero from "@/components/sections/Hero";
import VideoSection from "@/components/sections/VideoSection";
import Events from "@/components/sections/Events";
import Blogs from "@/components/sections/Blogs";
import News from "@/components/sections/News";
import AdvisorTeam from "@/components/sections/AdvisorTeam";
import CoreTeam from "@/components/sections/CoreTeam";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingActions />
      <main>
        <Hero />
        <VideoSection />
        <Events />
        <Blogs />
        <News />
        <AdvisorTeam />
        <CoreTeam />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
