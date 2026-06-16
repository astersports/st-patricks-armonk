import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Church, ChevronDown, ArrowRight, Clock, BookOpen, Users, Heart, Calendar, FileText, GraduationCap, Newspaper, Phone, UserPlus, HandHeart, Music, Cross, Search } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
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
    href: "/news",
    label: "Parish Life",
    children: [
      { href: "/news", label: "News" },
      { href: "/calendar", label: "Calendar (All Events)" },
      { href: "/gallery", label: "Photo Gallery" },
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

// Searchable page index — includes all pages with keywords for fuzzy matching
type SearchableItem = { href: string; label: string; keywords: string[]; icon: typeof Clock };

const searchablePages: SearchableItem[] = [
  { href: "/mass-times", label: "Mass Times & Confession", keywords: ["mass", "confession", "reconciliation", "schedule", "saturday", "sunday", "weekday", "holy day", "prayer", "lauds"], icon: Clock },
  { href: "/sacraments", label: "Sacraments", keywords: ["baptism", "confirmation", "marriage", "wedding", "funeral", "communion", "eucharist", "sponsor", "rcia", "anointing"], icon: Cross },
  { href: "/faith-formation", label: "Faith Formation", keywords: ["faith", "formation", "religious education", "rcia", "walking with purpose", "blaze", "adult"], icon: GraduationCap },
  { href: "/calendar?filter=ccd", label: "CCD Calendar", keywords: ["ccd", "religious ed", "class", "schedule", "catechism"], icon: Calendar },
  { href: "/ccd-registration", label: "CCD Registration", keywords: ["ccd", "register", "enroll", "religious ed", "sign up", "child"], icon: FileText },
  { href: "/ccd-permissions", label: "CCD Permission Forms", keywords: ["ccd", "permission", "release", "bus", "medical", "allergy", "pickup", "dismissal", "photo"], icon: FileText },
  { href: "/teen-life", label: "Teen Life", keywords: ["teen", "youth", "high school", "confirmation", "young"], icon: Users },
  { href: "/news", label: "News", keywords: ["news", "announcement", "update", "parish"], icon: Newspaper },
  { href: "/calendar", label: "Calendar (All Events)", keywords: ["calendar", "events", "schedule", "upcoming", "parish", "cyo", "ccd"], icon: Calendar },
  { href: "/calendar?filter=key-dates", label: "Key Dates 2026–2027", keywords: ["key dates", "important dates", "parish calendar", "milestones", "annual", "year"], icon: Calendar },
  { href: "/bulletins", label: "Weekly Bulletins", keywords: ["bulletin", "weekly", "pdf", "download", "read"], icon: BookOpen },
  { href: "/calendar?filter=cyo", label: "CYO Schedule", keywords: ["cyo", "basketball", "sports", "practice", "youth", "athletics"], icon: Calendar },
  { href: "/ministries", label: "Ministries & Devotions", keywords: ["ministry", "devotion", "lector", "eucharistic", "choir", "music", "rosary", "prayer", "share care", "fiat", "embrace"], icon: HandHeart },
  { href: "/volunteer", label: "Volunteer", keywords: ["volunteer", "help", "serve", "sign up", "get involved"], icon: Users },
  { href: "/forms", label: "Forms & Documents", keywords: ["form", "document", "download", "pdf", "application"], icon: FileText },
  { href: "/giving", label: "Give Online", keywords: ["give", "donate", "offering", "weshare", "venmo", "tithe", "stewardship", "cardinal", "appeal"], icon: Heart },
  { href: "/contact", label: "Contact Us", keywords: ["contact", "phone", "email", "address", "office", "hours", "directions", "map"], icon: Phone },
  { href: "/gallery", label: "Photo Gallery", keywords: ["photo", "gallery", "pictures", "images", "events", "album"], icon: Church },
  { href: "/about", label: "Our Parish", keywords: ["about", "parish", "history", "armonk", "cross", "community"], icon: Church },
  { href: "/new-here", label: "New Here? Plan Your Visit", keywords: ["new", "visit", "welcome", "first time", "directions", "what to expect"], icon: UserPlus },
  { href: "/staff", label: "Staff & Leadership", keywords: ["staff", "pastor", "priest", "deacon", "director", "leadership", "team", "contact"], icon: Users },
  { href: "/parish-registration", label: "Register as a Parishioner", keywords: ["register", "new member", "join", "parishioner", "sign up", "family"], icon: UserPlus },
];

// Grouped mobile menu matching site flow
type MobileMenuSection = {
  title: string;
  items: { href: string; label: string; icon: typeof Clock }[];
};

const mobileMenuSections: MobileMenuSection[] = [
  {
    title: "Worship",
    items: [
      { href: "/mass-times", label: "Mass Times & Confession", icon: Clock },
      { href: "/sacraments", label: "Sacraments", icon: Cross },
    ],
  },
  {
    title: "Faith Formation",
    items: [
      { href: "/faith-formation", label: "Overview", icon: GraduationCap },
      { href: "/calendar?filter=ccd", label: "CCD Calendar", icon: Calendar },
      { href: "/ccd-registration", label: "CCD Registration", icon: FileText },
      { href: "/ccd-permissions", label: "CCD Permission Forms", icon: FileText },
      { href: "/teen-life", label: "Teen Life", icon: Users },
    ],
  },
  {
    title: "Parish Life",
    items: [
      { href: "/news", label: "News", icon: Newspaper },
      { href: "/calendar", label: "Calendar", icon: Calendar },
      { href: "/gallery", label: "Photo Gallery", icon: Church },
      { href: "/bulletins", label: "Weekly Bulletins", icon: BookOpen },
      { href: "/calendar?filter=cyo", label: "CYO Schedule", icon: Calendar },
      { href: "/ministries", label: "Ministries & Devotions", icon: HandHeart },
      { href: "/volunteer", label: "Volunteer", icon: Users },
      { href: "/forms", label: "Forms & Documents", icon: FileText },
    ],
  },
  {
    title: "Give & Connect",
    items: [
      { href: "/giving", label: "Give Online", icon: Heart },
      { href: "/contact", label: "Contact Us", icon: Phone },
    ],
  },
  {
    title: "About",
    items: [
      { href: "/about", label: "Our Parish", icon: Church },
      { href: "/new-here", label: "New Here? Plan Your Visit", icon: UserPlus },
      { href: "/staff", label: "Staff & Leadership", icon: Users },
      { href: "/parish-registration", label: "Register as a Parishioner", icon: UserPlus },
    ],
  },
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
        className={`nav-link-underline flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
          isActive
            ? "text-primary active"
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

function MobileMenu({ location, isAuthenticated, isAdmin, onClose }: {
  location: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when menu opens
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return searchablePages
      .map((page) => {
        const labelMatch = page.label.toLowerCase().includes(q);
        const matchedKeywords = page.keywords.filter((kw) => kw.includes(q));
        if (!labelMatch && matchedKeywords.length === 0) return null;
        return { ...page, matchedKeywords, labelMatch };
      })
      .filter(Boolean) as (SearchableItem & { matchedKeywords: string[]; labelMatch: boolean })[];
  }, [query]);

  const showSearch = query.trim().length > 0;

  // Highlight matching substring in text
  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-primary/15 text-primary font-medium rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="lg:hidden border-t border-border/50 bg-white animate-slide-down max-h-[70vh] overflow-y-auto pb-16">
      <div className="container py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages... (e.g. baptism, CCD, giving)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-lg placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {showSearch && (
          <div className="space-y-1">
            {searchResults.length > 0 ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 mb-1">
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </p>
                {searchResults.map((item) => {
                  const isActive = location === item.href;
                  const q = query.toLowerCase().trim();
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
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm">{item.labelMatch ? highlightMatch(item.label, q) : item.label}</span>
                        {item.matchedKeywords.length > 0 && !item.labelMatch && (
                          <span className="text-[11px] text-muted-foreground mt-0.5">
                            Matches: {item.matchedKeywords.slice(0, 3).map((kw, i) => (
                              <span key={kw}>{i > 0 && ", "}{highlightMatch(kw, q)}</span>
                            ))}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </>
            ) : (
              <div className="flex flex-col items-center py-8 px-4">
                <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground/70 mb-1">
                  No pages found
                </p>
                <p className="text-xs text-muted-foreground text-center max-w-[220px]">
                  Try a different keyword like "mass", "baptism", "CCD", or "volunteer"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Grouped sections (hidden when searching) */}
        {!showSearch && (
          <>
            {mobileMenuSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 mb-1">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 gap-0.5">
                  {section.items.map((item) => {
                    const isActive = location === item.href || location.startsWith(item.href.split('?')[0] + '?');
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
                </div>
              </div>
            ))}
            {isAuthenticated && isAdmin && (
              <div className="border-t border-border/50 pt-3 mt-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 mb-1">
                  Administration
                </h3>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary bg-primary/5"
                >
                  <Church className="w-4 h-4 text-primary" />
                  Admin Dashboard
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

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
        {/* Scrolling Announcement Bar */}
        <div className="bg-primary text-white py-2 overflow-hidden relative">
          <div className="announcement-marquee flex whitespace-nowrap">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-12 px-8 shrink-0 announcement-marquee-content">
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
              <span className="text-[10px] text-muted-foreground leading-tight tracking-widest uppercase">
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
      <MobileBottomNav onMoreClick={handleMoreClick} />
    </>
  );
}
