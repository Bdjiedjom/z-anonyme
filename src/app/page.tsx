import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SecuritySection } from "@/components/landing/security-section";
import { UseCases } from "@/components/landing/use-cases";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";
import { AuthWrapper } from "@/components/auth/home-redirect";

export default function LandingPage() {
  return (
    <AuthWrapper>
      <div
        className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary"
        suppressHydrationWarning
      >
        <LandingNavbar />
        <main>
          <Hero />
          <SocialProof />
          <Features />
          <HowItWorks />
          <SecuritySection />
          <UseCases />
          <FaqSection />
          <CtaSection />
        </main>
        <LandingFooter />
      </div>
    </AuthWrapper>
  );
}
