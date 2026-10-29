import IntroLoader from "@/components/IntroLoader";
import Header from "@/components/Header";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import HeroSection from "@/components/HeroSection";
import HeroGalleryCarousel from "@/components/HeroGalleryCarousel";
import OverviewSection from "@/components/OverviewSection";
import CategoriesSection from "@/components/CategoriesSection";
import ScheduleFlowSection from "@/components/ScheduleFlowSection";
import WildCardVotingSection from "@/components/WildCardVotingSection";
import FashionOnWheelsSection from "@/components/FashionOnWheelsSection";
import RegistrationFormSection from "@/components/RegistrationFormSection";
import PrizesSection from "@/components/PrizesSection";
import RulesSection from "@/components/RulesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-24 text-charcoal md:pb-0">
      {/* 0. Initial Brand Loader + Official Event Poster Showcase */}
      <IntroLoader />

      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Horizontal Announcement Marquee with All Official Sponsors */}
      <AnnouncementTicker />

      {/* 3. Hero Section with Live Countdown & Highlights */}
      <HeroSection />

      {/* 3B. Sticky Scroll Pinned Showcase: Real Glimpses from Phoenix United, Bareilly */}
      <HeroGalleryCarousel />

      {/* 4. Event Overview & 4 Core Pillars */}
      <OverviewSection />

      {/* 5. Age & Ramp Walk Categories */}
      <CategoriesSection />

      {/* 6. Chronological Schedule & Flow (Oct to Nov) */}
      <ScheduleFlowSection />

      {/* 7. Social Media Wild Card Voting & Live Nominees Board */}
      <WildCardVotingSection />

      {/* 8. Signature Attraction: Fashion on Wheels Tour */}
      <FashionOnWheelsSection />

      {/* 9. Core Feature: Registration Form & Real-Time Voting Card Generator */}
      <RegistrationFormSection />

      {/* 10. Winner Rewards & Cash Prizes */}
      <PrizesSection />

      {/* 11. Official Guidelines & Parent FAQs */}
      <RulesSection />

      {/* 12. Footer with IEM & AdOnMo Credentials */}
      <Footer />
    </main>
  );
}
