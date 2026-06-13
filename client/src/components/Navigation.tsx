import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Church, ChevronDown, ArrowRight, Clock, BookOpen, Users, Heart, Calendar, FileText, GraduationCap, Newspaper, Phone, UserPlus, HandHeart, Music, Cross } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import MobileBottomNav from "./MobileBottomNav";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const navLinks: NavItem[] = [
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "Our Parish" },
      { href: "/new-here", label: "New Here? Plan Your Visit" },
      { href: "/staff", label: "Staff & Leadership" },
      { href: "/parish-registration", label: "New Parishioner Registration" },
    ],
  },
  {
    href: "/mass-times",
    label: "Mass & Prayer",
    children: [
      { href: "/mass-times", label: "Mass Times & Confession" },
      { href: "/sacraments", label: "Sacraments" },
    ],
  },
  {
    href: "/faith-formation",
    label: "Faith Formation",
    children: [
      { href: "/faith-formation", label: "Overview" },
      { href: "/calendar?filter=ccd", label: "CCD Calendar" },
      { href: "/ccd-registration", label: "CCD Registration" },
      { href: "/ccd-permissions", label: "CCD Permission Forms" },
      { href: "/teen-life", label: "Teen Life" },
    ],
  },
  {
    href: "/news-events",
    label: "Parish Life",
    children: [
      { href: "/news-events", label: "News & Announcements" },
      { href: "/calendar", label: "Calendar (All Events)" },
      { href: "/bulletins", label: "Weekly Bulletins" },
      { href: "/calendar?filter=cyo", label: "CYO Schedule" },
      { href: "/ministries", label: "Ministries & Devotions" },
      { href: "/volunteer", label: "Volunteer" },
      { href: "/forms", label: "Forms & Documents" },
    ],
  },
  { href: "/giving", label: "Giving" },
  { href: "/contact", label: "Contact" },
];

// Flat list for the simplified mobile menu
const mobileMenuItems = [
  { href: "/mass-times", label: "Mass Times & Confession", icon: Clock },
  { href: "/sacraments", label: "Sacraments", icon: Cross },
  { href: "/faith-formation", label: "Faith Formation", icon: GraduationCap },
  { href: "/calendar?filter=ccd", label: "CCD Calendar", icon: Calendar },
  { href: "/ccd-registration", label: "CCD Registration", icon: FileText },
  { href: "/news-events", label: "News & Events", icon: Newspaper },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/bulletins", label: "Weekly Bulletins", icon: BookOpen },
  { href: "/ministries", label: "Ministries & Devotions", icon: HandHeart },
  { href: "/giving", label: "Give Online", icon: Heart },
  { href: "/volunteer", label: "Volunteer", icon: Users },
  { href: "/about", label: "About Our Parish", icon: Church },
  { href: "/staff", label: "Staff & Leadership", icon: Users },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/parish-registration", label: "Register as a Parishioner", icon: UserPlus },
];

function DesktopDropdown({ item, location }: { item: NavItem; location: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isActive = item.children?.some(c => c.href === location) || item.href === location;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
          isActive
            ? "text-primary"
            : "text-foreground/70 hover:text-primary"
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1.5 z-50">
          <div className="nav-dropdown-enter bg-white rounded-lg shadow-md ring-1 ring-black/[0.04] py-1.5 min-w-[200px]">
            {item.children!.map(child => (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3.5 py-2 text-[13px] transition-colors duration-100 ${
                  location === child.href
                    ? "text-primary font-medium"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/[0.04]"
                }`}
                onClick={() => setOpen(false)}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleMoreClick = () => {
    setMobileOpen(true);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-primary text-white text-center py-2 px-4">
          <Link
            href="/parish-registration"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline transition-all"
          >
            <span className="hidden sm:inline">New to St. Patrick's?</span>
            <span className="font-semibold">Register as a Parishioner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
              <span className="text-[10px] text-muted-foreground leading-tight tracking-widest uppercase">
                Armonk, NY
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    location === link.href
                      ? "text-primary"
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

        {/* Mobile Menu - Flat list */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border/50 bg-white animate-slide-down max-h-[70vh] overflow-y-auto pb-16">
            <div className="container py-3">
              <div className="grid grid-cols-1 gap-0.5">
                {mobileMenuItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "text-primary bg-primary/5 font-medium"
                          : "text-foreground/80 active:bg-primary/5"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-accent"
                  >
                    <Church className="w-4 h-4 text-accent" />
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Bottom Tab Bar - Mobile only */}
      <MobileBottomNav onMoreClick={handleMoreClick} />
    </>
  );
}
