import { Link, useLocation } from "wouter";
import { ArrowLeft, Calendar, BookOpen, Dribbble } from "lucide-react";

const calendars = [
  { href: "/parish-calendar", label: "Parish", icon: Calendar },
  { href: "/ccd-calendar", label: "CCD", icon: BookOpen },
  { href: "/cyo-basketball", label: "CYO", icon: Dribbble },
];

export default function CalendarNav() {
  const [location] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-background border-b border-border/60 sticky top-0 z-30">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-2 py-2.5">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pr-3 border-r border-border/50 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Calendar Tabs */}
          <nav className="flex items-center gap-1 ml-1">
            {calendars.map((cal) => {
              const isActive = location === cal.href;
              return (
                <Link key={cal.href} href={cal.href}>
                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <cal.icon className="w-3.5 h-3.5" />
                    {cal.label}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
