import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Church, ChevronDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const navLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/mass-times", label: "Mass Times" },
  { href: "/news-events", label: "News & Events" },
  { href: "/bulletins", label: "Bulletins" },
  {
    href: "/faith-formation",
    label: "Faith Formation",
    children: [
      { href: "/faith-formation", label: "Overview" },
      { href: "/ccd-calendar", label: "CCD Calendar" },
      { href: "/ccd-registration", label: "CCD Registration" },
    ],
  },
  {
    href: "/cyo-basketball",
    label: "CYO",
    children: [
      { href: "/cyo-basketball", label: "Basketball Schedule" },
    ],
  },
  {
    href: "/ministries",
    label: "Ministries",
    children: [
      { href: "/ministries", label: "Devotions & Ministries" },
      { href: "/volunteer", label: "Volunteer Sign-Up" },
    ],
  },
  { href: "/giving", label: "Giving" },
  { href: "/contact", label: "Contact" },
];

function DesktopDropdown({ item, location }: { item: NavItem; location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = item.children?.some(c => c.href === location) || item.href === location;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-0.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "text-primary bg-primary/5"
            : "text-foreground/70 hover:text-primary hover:bg-primary/5"
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[180px] z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {item.children!.map(child => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-4 py-2 text-sm transition-colors ${
                location === child.href
                  ? "text-primary bg-primary/5"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/5"
              }`}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="container flex items-center justify-between h-16 lg:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Church className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-primary leading-tight">St. Patrick</span>
            <span className="text-[10px] text-muted-foreground leading-tight tracking-wider uppercase">Armonk, NY</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.children ? (
              <DesktopDropdown key={link.href} item={link} location={location} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === "/admin"
                  ? "text-accent bg-accent/10"
                  : "text-accent/80 hover:text-accent hover:bg-accent/5"
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
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-scale-in max-h-[80vh] overflow-y-auto">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                {link.children ? (
                  <>
                    <span className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {link.label}
                    </span>
                    {link.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          location === child.href
                            ? "text-primary bg-primary/5"
                            : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location === link.href
                        ? "text-primary bg-primary/5"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-3 rounded-lg text-sm font-medium text-accent hover:bg-accent/5"
                onClick={() => setMobileOpen(false)}
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
