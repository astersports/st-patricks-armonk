import { Link, useLocation } from "wouter";
import { Clock, Calendar, Heart, MoreHorizontal } from "lucide-react";

const tabs = [
  { href: "/mass-times", label: "Mass", icon: Clock },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/giving", label: "Give", icon: Heart },
  { href: "/__more__", label: "More", icon: MoreHorizontal },
];

interface MobileBottomNavProps {
  onMoreClick: () => void;
}

export default function MobileBottomNav({ onMoreClick }: MobileBottomNavProps) {
  const [location] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/[0.97] backdrop-blur-xl border-t border-border/20">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-3">
        {tabs.map((tab) => {
          const isMore = tab.href === "/__more__";
          const isActive = !isMore && location === tab.href;

          if (isMore) {
            return (
              <button
                key={tab.label}
                onClick={onMoreClick}
                className="flex flex-col items-center justify-center gap-[3px] w-16 py-1.5 rounded-xl transition-all duration-200 text-muted-foreground/70 active:scale-[0.92] active:bg-muted/30"
              >
                <tab.icon className="w-[21px] h-[21px]" strokeWidth={1.8} />
                <span className="text-[10px] font-medium tracking-tight">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center gap-[3px] w-16 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/70 active:scale-[0.92] active:bg-muted/30"
              }`}
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
