import NavBar            from "@/components/sections/NavBar";
import HeroSection       from "@/components/sections/HeroSection";
import LogoStrip         from "@/components/sections/LogoStrip";
import ProblemSection    from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesSection   from "@/components/sections/FeaturesSection";
import WhyOralSection    from "@/components/sections/WhyOralSection";
import ProctoringSection from "@/components/sections/ProctoringSection";
import CertificateSection from "@/components/sections/CertificateSection";
import UseCasesSection   from "@/components/sections/UseCasesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection    from "@/components/sections/PricingSection";
import FAQSection        from "@/components/sections/FAQSection";
import FinalCTASection   from "@/components/sections/FinalCTASection";
import Footer            from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main>
        <HeroSection />
        <LogoStrip />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <WhyOralSection />
        <ProctoringSection />
        <CertificateSection />
        <UseCasesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
