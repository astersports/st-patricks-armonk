import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Church, ChevronDown, ArrowRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";

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
      { href: "/ccd-calendar", label: "CCD Calendar" },
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
      { href: "/parish-calendar", label: "Parish Calendar" },
      { href: "/bulletins", label: "Weekly Bulletins" },
      { href: "/cyo-basketball", label: "CYO Practice Schedule" },
      { href: "/ministries", label: "Ministries & Devotions" },
      { href: "/volunteer", label: "Volunteer" },
      { href: "/forms", label: "Forms & Documents" },
    ],
  },
  { href: "/giving", label: "Giving" },
  { href: "/contact", label: "Contact" },
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

  return (
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-white animate-slide-down max-h-[80vh] overflow-y-auto">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <MobileAccordion item={link} location={location} />
                ) : (
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location === link.href
                        ? "text-primary bg-primary/5"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-3 rounded-lg text-sm font-semibold text-accent hover:bg-accent/5"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileAccordion({ item, location }: { item: NavItem; location: string }) {
  const [open, setOpen] = useState(false);
  const isActive = item.children?.some(c => c.href === location);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "text-primary bg-primary/5"
            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
        }`}
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="ml-4 mt-1 mb-2 border-l-2 border-primary/20 pl-3 space-y-0.5 animate-scale-in">
          {item.children!.map(child => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-3 py-2.5 rounded-md text-sm transition-colors ${
                location === child.href
                  ? "text-primary font-medium bg-primary/5"
                  : "text-foreground/70 hover:text-primary"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
