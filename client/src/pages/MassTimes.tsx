/**
 * Mass Times Page — Composition of schedule, holy day alerts, and info sections.
 */

import PageLayout from "@/components/PageLayout";
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
