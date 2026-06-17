import { useLocation } from "wouter";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navigation from "./navigation";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Hide the back button even on interior pages (e.g., for pages with their own nav) */
  hideBackButton?: boolean;
}

export default function PageLayout({ children, hideBackButton }: PageLayoutProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {/* Back to Home button — shown on all interior pages */}
      {!isHome && !hideBackButton && (
        <div className="bg-background border-b border-border/40 lg:hidden">
          <div className="container">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      )}
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
      {/* Spacer for mobile bottom tab bar + safe area */}
      <div className="lg:hidden h-24" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
