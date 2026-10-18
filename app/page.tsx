import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Hero />
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 grid-backdrop opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]"
          aria-hidden
        />
        <div className="relative divide-y divide-white/[0.04]">
          <About />
          <Experience />
          <Projects />
          <Stack />
          <Contact />
        </div>
      </div>
      <Footer />
    </>
  );
}
