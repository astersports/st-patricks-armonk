/**
 * Mass Times Page — Composition of schedule, holy day alerts, and info sections.
 */

import PageLayout from "@/components/PageLayout";
import { SEO } from "@/components/SEO";
import { useReveal } from "@/hooks/useReveal";
import PageHeader from "@/components/PageHeader";
import { HolyDayAlert } from "./mass-times/HolyDayAlert";
import { WeeklySchedule } from "./mass-times/WeeklySchedule";
import { AtAGlance } from "./mass-times/AtAGlance";
import { WhatToExpect } from "./mass-times/WhatToExpect";

export default function MassTimes() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <SEO
        title="Mass Times & Confession"
        path="/mass-times"
        description="Mass schedule at St. Patrick Church, Armonk NY. Saturday Vigil 5:00 PM, Sunday 8:00 AM, 10:00 AM, 12:00 PM. Daily Mass Mon-Fri 8:30 AM. Confessions Saturday 4:00-4:45 PM."
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
