import { Link, useLocation } from "wouter";
import { Clock, Calendar, Heart, MoreHorizontal } from "lucide-react";

const tabs = [
  { href: "/mass-times", label: "Mass Times", icon: Clock },
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border/50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isMore = tab.href === "/__more__";
          const isActive = !isMore && location === tab.href;

          if (isMore) {
            return (
              <button
                key={tab.label}
                onClick={onMoreClick}
                className="flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors text-muted-foreground active:bg-primary/5"
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:bg-primary/5"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
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
