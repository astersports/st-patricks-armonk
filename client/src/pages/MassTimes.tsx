/**
 * Mass Times Page — Composition of schedule, holy day alerts, and info sections.
 * SEO description is generated from the shared schedule engine (single source of truth).
 */

import PageLayout from "@/components/PageLayout";
import { SEO } from "@/components/SEO";
import { useReveal } from "@/hooks/useReveal";
import PageHeader from "@/components/PageHeader";
import { HolyDayAlert } from "./mass-times/HolyDayAlert";
import { WeeklySchedule } from "./mass-times/WeeklySchedule";
import { AtAGlance } from "./mass-times/AtAGlance";
import { WhatToExpect } from "./mass-times/WhatToExpect";
import { useParishSchedule, generateSEODescription } from "@/hooks/useParishSchedule";
import { DEFAULT_PARISH_SCHEDULE } from "../../../shared/scheduleEngine";

export default function MassTimes() {
  const revealRef = useReveal();
  const { schedule } = useParishSchedule();

  // Use live schedule from DB if available, otherwise fall back to default
  const seoDescription = generateSEODescription(schedule ?? DEFAULT_PARISH_SCHEDULE);

  return (
    <PageLayout>
      <SEO
        title="Mass Times & Confession"
        path="/mass-times"
        description={seoDescription}
      />
      <PageHeader
        eyebrow="Worship With Us"
        title="Mass Times & Confession"
        description="Join us in worship and prayer. All are welcome at St. Patrick's."
      />

      <div ref={revealRef} className="container py-6 sm:py-10 space-y-8">
        <HolyDayAlert />
        <WeeklySchedule />
        <AtAGlance />
        <WhatToExpect />
      </div>
    </PageLayout>
  );
}
