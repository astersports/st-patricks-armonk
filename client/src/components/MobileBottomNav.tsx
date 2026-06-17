import { Link, useLocation } from "wouter";
import { Home, Clock, BookOpen, Calendar, Heart } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/mass-times", label: "Mass", icon: Clock },
  { href: "/bulletins", label: "Bulletin", icon: BookOpen },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/giving", label: "Give", icon: Heart },
];

export default function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/[0.97] backdrop-blur-xl border-t border-border/20" role="navigation" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {

          const isHome = tab.href === "/";
          const isActive = isHome ? location === "/" : location.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center gap-[3px] min-w-[44px] min-h-[44px] w-14 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/70 active:scale-[0.92] active:bg-muted/30"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span
                  className="absolute -top-[1px] w-8 h-[3px] rounded-full bg-primary"
                  style={{ boxShadow: "0 1px 4px oklch(0.47 0.14 160 / 0.3)" }}
                />
              )}
              <tab.icon
                className={`w-[21px] h-[21px] transition-all duration-200 ${
                  isActive ? "text-primary scale-105" : ""
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                className={`text-[10px] tracking-tight transition-all duration-200 ${
                  isActive ? "text-primary font-bold" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
