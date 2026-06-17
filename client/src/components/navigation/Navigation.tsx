/**
 * Navigation — Main header component with desktop nav, mobile menu, and bottom tab bar.
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Church, ArrowRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import MobileBottomNav from "../MobileBottomNav";

import { navLinks } from "./menuData";
import { DesktopDropdown } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: marqueeData } = trpc.siteSettings.get.useQuery({ key: "marquee_text" });
  const marqueeText = marqueeData?.value || "New to St. Patrick in Armonk? Register as a Parishioner";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);



  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        {/* Top Bar with YouTube Live Stream + Announcement */}
        <div className="bg-primary text-white py-2 overflow-hidden relative">
          <div className="announcement-marquee flex whitespace-nowrap">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-12 px-8 shrink-0 announcement-marquee-content">
                <a
                  href="https://youtube.com/@stpatricksarmonk?si=Nf71id_fwNyCT_Ob"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span>Watch Live Mass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <span className="text-white/40">•</span>
                <Link
                  href="/parish-registration"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline transition-all"
                >
                  <span>{marqueeText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-white/40">•</span>
              </div>
            ))}
          </div>
        </div>
        <nav className="container flex items-center justify-between h-16 lg:h-[4.5rem]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Church className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-primary leading-tight tracking-tight">
                St. Patrick
              </span>
              <span className="text-xs text-muted-foreground leading-tight tracking-widest uppercase">
                in Armonk
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <DesktopDropdown key={link.label} item={link} location={location} />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link-underline px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    location === link.href
                      ? "text-primary active"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className={`ml-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
                  location === "/admin"
                    ? "bg-accent text-accent-foreground"
                    : "bg-accent/10 text-accent-foreground/80 hover:bg-accent/20"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden press-scale"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        {/* Mobile Menu - Grouped sections with search */}
        {mobileOpen && (
          <MobileMenu
            location={location}
            isAuthenticated={isAuthenticated}
            isAdmin={user?.role === "admin"}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </header>

      {/* Bottom Tab Bar - Mobile only */}
      <MobileBottomNav />
    </>
  );
}
