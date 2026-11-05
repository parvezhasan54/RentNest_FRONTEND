import { getPublicStats } from "@/service/stats.service";
import HeroSection from "./_component/hero-section";
import CategoriesSection from "./_component/categories-section";
import FeaturedProperties from "./_component/featured-properties";
import HowItWorks from "./_component/how-it-works";
import StatsSection from "./_component/stats-section";
;

import PopularCities from "./_component/popular-cities";
import LatestListings from "./_component/latest-listings";
import AiPromo from "./_component/ai-promo";
import FeaturesSection from "./_component/features-section";
import Testimonials from "./_component/testimonials-section";
import BlogHighlights from "./_component/blog-highlights";
import FaqSection from "./_component/faq-section";
import Newsletter from "./_component/newsletter-section";
import CTASection from "./_component/cta-section";

export default async function Home() {
  const stats = await getPublicStats();
  return (
    <div>
      <HeroSection stats={stats} />
      <CategoriesSection categories={stats.categories} />
      <FeaturedProperties />
      <HowItWorks />
      <StatsSection stats={stats} />
      <PopularCities cities={stats.cities} />
      <LatestListings />
      <AiPromo />
      <Testimonials reviews={stats.reviews} />
      <FeaturesSection />
      <BlogHighlights/>
      <FaqSection />
      <Newsletter />
      <CTASection total={stats.totalProperties} />
    </div>
  );
}