import { getPublicStats } from "@/service/stats.service";
import { Reveal } from "@/components/motion/Reveal";
import HeroSection from "./_component/hero-section";
import CategoriesSection from "./_component/categories-section";
import FeaturedProperties from "./_component/featured-properties";
import TrendingSection from "./_component/trending-section";
import HowItWorks from "./_component/how-it-works";
import StatsSection from "./_component/stats-section";
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
      <Reveal><CategoriesSection categories={stats.categories} /></Reveal>
      <Reveal><FeaturedProperties /></Reveal>
      <Reveal><TrendingSection /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <StatsSection stats={stats} />
      <Reveal><PopularCities cities={stats.cities} /></Reveal>
      <Reveal><LatestListings /></Reveal>
      <Reveal><AiPromo /></Reveal>
      <Reveal><Testimonials reviews={stats.reviews} /></Reveal>
      <Reveal><FeaturesSection /></Reveal>
      <Reveal><BlogHighlights /></Reveal>
      <Reveal><FaqSection /></Reveal>
      <Reveal><Newsletter /></Reveal>
      <Reveal><CTASection total={stats.totalProperties} /></Reveal>
    </div>
  );
}