import { Link } from "wouter";
import { Lock } from "lucide-react";

/**
 * Data-handling disclosure shown on digital forms. The `childData` variant adds
 * the minors'-data language required for forms that collect information about
 * children (CCD, sacraments) — per the forms-rehost spec §6 and the Archdiocese
 * of New York Safe Environment / privacy practice.
 */
export default function FormPrivacyNote({
  childData = false,
  className = "",
}: {
  childData?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`flex items-start gap-2 text-xs text-muted-foreground leading-relaxed ${className}`}
    >
      <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
      <span>
        {childData
          ? "Your child's information is kept private — stored securely, visible only to authorized parish staff, and never shared publicly. "
          : "Your information is used only to respond to this request and is never sold or shared for advertising. "}
        See our{" "}
        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        {childData ? (
          <>
            {" "}and{" "}
            <Link href="/safe-environment" className="text-primary hover:underline">Safe Environment</Link>{" "}
            commitment.
          </>
        ) : (
          "."
        )}
      </span>
    </p>
  );
}
