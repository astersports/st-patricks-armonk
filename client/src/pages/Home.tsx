import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { PrayerWall } from "@/components/PrayerWall";
import { SEO, CHURCH_STRUCTURED_DATA } from "@/components/SEO";
import { ThisWeekAccordion } from "@/components/ThisWeekAccordion";
import { useReveal } from "@/hooks/useReveal";
import {
  HeroSection,
  NowAtStPatrick,
  ThisWeeksBulletin,
  PhotoGallerySection,
  SaintOfDayCard,
  DailyReadings,
  JourneyCardsSection,
  CatholicResources,
  RainAlertBanner,
  NewsletterSection,
} from "./home";

export default function Home() {
  const { data: newsItems } = trpc.news.listPublished.useQuery();
  const { data: allImportantDates } = trpc.importantDates.allPublished.useQuery();
  const revealRef = useReveal();

  // Get latest news item
  const latestNews = newsItems?.[0];

  return (
    <PageLayout>
      <SEO
        path="/"
        description="Welcome to St. Patrick Church in Armonk, NY. Join our vibrant Catholic community for Mass, sacraments, faith formation, and fellowship. Mass times, bulletins, events, and more."
        structuredData={CHURCH_STRUCTURED_DATA}
      />
      {/* Hero Section — Cinematic with Ken Burns + Time Greeting + Next Mass */}
      <HeroSection />

      {/* Rain Alert Banner — shows when today's precipitation probability > 60% */}
      <RainAlertBanner />

      <div ref={revealRef}>
        {/* This Week — Day-by-day schedule accordion (worship schedule first) */}
        <section className="reveal container mb-6 sm:mb-8">
          <ThisWeekAccordion />
        </section>

        {/* Now at St. Patrick — Live status + upcoming events + latest news */}
        <NowAtStPatrick latestNews={latestNews} newsItems={newsItems} allImportantDates={allImportantDates} />

        {/* Pastor's Welcome */}
        <section className="reveal container py-8 sm:py-12 mb-4 sm:mb-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-10 h-0.5 bg-gold mx-auto mb-5" />
            <blockquote className="font-serif text-lg sm:text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
              "Whether you are a lifelong parishioner or visiting for the first time, you are welcome here. St. Patrick in Armonk is a place where faith grows, friendships form, and everyone belongs."
            </blockquote>
            <p className="mt-4 text-foreground/70 font-medium text-sm">— Fr. Thadeus Aravindathu, Pastor</p>
          </div>
        </section>

        {/* 4 Journey Cards — stacked vertically on mobile, 4-col grid on desktop */}
        <JourneyCardsSection />

        {/* This Week's Bulletin */}
        <ThisWeeksBulletin />

        {/* Photo Gallery */}
        <section className="reveal container mb-6 sm:mb-8">
          <PhotoGallerySection />
        </section>

        {/* Catholic Resources — Live Feeds by Source */}
        <section className="reveal section-cream py-8 sm:py-10 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <CatholicResources />
          </div>
        </section>

        {/* Daily Readings — Dark Premium Section */}
        <section className="reveal section-dark-green py-8 sm:py-10 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <DailyReadings />
          </div>
        </section>

        {/* Saint of the Day */}
        <section className="reveal container py-4 sm:py-6">
          <SaintOfDayCard />
        </section>

        {/* Prayer Wall — Light a Candle */}
        <section className="reveal section-cream py-8 sm:py-10 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <PrayerWall />
        </section>

        {/* Newsletter Subscription — Full-width dark CTA */}
        <NewsletterSection />
      </div>
    </PageLayout>
  );
}
