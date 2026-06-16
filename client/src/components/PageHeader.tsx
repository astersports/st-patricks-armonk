import { ReactNode } from "react";

interface PageHeaderProps {
  /** Gold eyebrow text above the heading (e.g., "Worship With Us") */
  eyebrow: string;
  /** Main page heading */
  title: string;
  /** Optional description below the heading */
  description?: string;
  /** Optional additional content below the description (e.g., address/phone row) */
  children?: ReactNode;
}

/**
 * L99 Inner Page Header — consistent across all public pages.
 * 
 * Design: Clean section with subtle green gradient background,
 * gold eyebrow label, Fraunces serif heading, and optional description.
 * Fluid typography using clamp() for responsive sizing.
 */
export default function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <section className="relative py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, oklch(0.96 0.02 160 / 0.5) 0%, transparent 100%)`,
        }}
      />
      <div className="container relative">
        {/* Eyebrow */}
        <p
          className="text-[oklch(0.72_0.16_79)] font-semibold tracking-[0.15em] uppercase mb-3 opacity-0 animate-fade-in"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "clamp(0.6875rem, 0.65rem + 0.19vw, 0.75rem)",
          }}
        >
          {eyebrow}
        </p>

        {/* Main heading — Fraunces with optical sizing */}
        <h1
          className="text-foreground mb-3 opacity-0 animate-fade-in stagger-1"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.75rem)",
            fontOpticalSizing: "auto",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            className="text-muted-foreground max-w-xl opacity-0 animate-fade-up stagger-2"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "clamp(0.9375rem, 0.89rem + 0.24vw, 1.0625rem)",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}

        {/* Optional extra content (meta row, badges, etc.) */}
        {children && (
          <div className="mt-4 opacity-0 animate-fade-up stagger-3">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
