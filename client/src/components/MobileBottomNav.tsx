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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-border/30 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-[52px] max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isMore = tab.href === "/__more__";
          const isActive = !isMore && location === tab.href;

          if (isMore) {
            return (
              <button
                key={tab.label}
                onClick={onMoreClick}
                className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors text-muted-foreground active:scale-95"
              >
                <tab.icon className="w-[22px] h-[22px]" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:scale-95"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-5 h-0.5 rounded-full bg-primary" />
              )}
              <tab.icon className={`w-[22px] h-[22px] transition-colors ${isActive ? "text-primary" : ""}`} />
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-primary" : ""}`}>
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
