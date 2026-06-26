import { Link } from "wouter";
import { ShieldCheck, ArrowRight } from "lucide-react";

/**
 * Reusable Safe Environment disclosure for surfaces where adults may sign up to
 * work with minors (volunteer, faith formation, youth ministries). States the
 * Archdiocese of New York requirement up front and links to the full page.
 */
export default function SafeEnvironmentNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border/60 bg-primary/5 p-4 ${className}`}
      role="note"
      aria-label="Safe Environment requirement for working with children"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Working with children?</strong> The Archdiocese of New York requires
        everyone in regular contact with minors to complete Safer Spaces / VIRTUS training and a background check
        before serving.{" "}
        <Link href="/safe-environment" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
          Learn more <ArrowRight className="w-3 h-3" />
        </Link>
      </p>
    </div>
  );
}
