import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import BannerSection from '@/components/BannerSection';
import GallerySection from '@/components/GallerySection';
import GiftCardsSection from '@/components/GiftCardsSection';
import ServicesSection from '@/components/ServicesSection';
import OpenHoursSection from '@/components/OpenHoursSection';
import PricingSection from '@/components/PricingSection';
import BookingCTASection from '@/components/BookingCTASection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PackagesSection from '@/components/PackagesSection';
import BlogSection from '@/components/BlogSection';
import BookingSection from '@/components/BookingSection';
import FooterCTASection from '@/components/FooterCTASection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* Global Header */}
      <Header />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Welcome / Services Intro */}
      <WelcomeSection />

      {/* 3. About Section */}
      <AboutSection />

      {/* 3b. Experience Section */}
      <ExperienceSection />

      {/* 4. Banner - First Discount */}
      {/* <BannerSection
        discount="25% OFF"
        title="For All Spa Procedures"
        subtitle="This month only — treat yourself or someone special to the ultimate spa experience."
        ctaText="Book Now"
        ctaHref="#booking"
        bgColor="bg-spa-rose"
      /> */}

      {/* 5. Gallery Section */}
      <GallerySection />

      {/* 6. Gift Cards Section */}
      <GiftCardsSection />

      {/* 7. Services Section */}
      <ServicesSection />

      {/* 8. Open Hours + Booking CTA */}
      <OpenHoursSection />

      {/* 9. Pricing Section */}
      <PricingSection />

      {/* 10. Banner - Second Discount */}
      {/* <BannerSection
        discount="50% OFF"
        title="Aroma & Jet Hydrotherapy!"
        subtitle="Limited time offer for new clients. Experience our signature hydrotherapy treatment at half price."
        ctaText="Find Out More"
        ctaHref="#services"
        bgImage="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80"
      /> */}

      {/* 11. Booking CTA Banner */}
      <BookingCTASection />

      {/* 13. Testimonials Section */}
      <TestimonialsSection />

      {/* 14. Banner - Third Discount */}
      {/* <BannerSection
        discount="20% OFF"
        title="For Your First Visit"
        subtitle="New to USH Spa? Enjoy 20% off your first treatment when you book through our mobile app."
        ctaText="Book Now"
        ctaHref="#booking"
        bgColor="bg-spa-rosybrown"
      /> */}

      {/* 15. Packages Section */}
      {/* <PackagesSection /> */}

      {/* 16. Blog Section */}
      <BlogSection />

      {/* 17. Booking Form Section */}
      <BookingSection />

      {/* 18. Footer CTA */}
      {/* <FooterCTASection /> */}

      {/* 19. Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </main>
  );
}
