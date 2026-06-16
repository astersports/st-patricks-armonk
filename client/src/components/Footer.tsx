import { Link } from "wouter";
import { MapPin, Phone, Shield } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

function StaffAccessBar() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <div className="border-t border-white/8">
      <div className="container py-2 flex items-center justify-center">
        {isAdmin ? (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-gold transition-colors"
          >
            <Shield className="w-3 h-3" />
            Admin Dashboard
          </Link>
        ) : (
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <Shield className="w-3 h-3" />
            Staff Login
          </a>
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-parish-green text-white">
      {/* Main Footer Content */}
      <div className="container py-8 sm:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Left: Church identity */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-gold leading-tight">St. Patrick in Armonk</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold/60" />
                29 Cox Ave, Armonk NY 10504
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <a href="tel:9142739724" className="flex items-center gap-1.5 hover:text-gold transition-colors">
                <Phone className="w-3.5 h-3.5 text-gold/60 sm:hidden" />
                (914) 273-9724
              </a>
            </div>
          </div>

          {/* Center: Quick links */}
          <nav className="grid grid-cols-3 gap-x-6 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
            <Link href="/mass-times" className="text-sm text-white/70 hover:text-gold transition-colors">Mass Times</Link>
            <Link href="/news" className="text-sm text-white/70 hover:text-gold transition-colors">News</Link>
            <Link href="/calendar" className="text-sm text-white/70 hover:text-gold transition-colors">Calendar</Link>
            <Link href="/giving" className="text-sm text-white/70 hover:text-gold transition-colors">Giving</Link>
            <Link href="/bulletins" className="text-sm text-white/70 hover:text-gold transition-colors">Bulletin</Link>
            <Link href="/contact" className="text-sm text-white/70 hover:text-gold transition-colors">Contact</Link>
            <Link href="/faith-formation" className="text-sm text-white/70 hover:text-gold transition-colors col-span-2 sm:col-span-1">Faith Formation</Link>
          </nav>

          {/* Right: Stay connected buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="https://stpatarmonk.flocknote.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gold/10 border border-gold/25 text-gold px-3.5 py-1.5 rounded-full hover:bg-gold/20 active:scale-97 transition-all duration-200 font-bold"
            >
              Flocknote
            </a>
            <a
              href="http://www.youtube.com/@StPatricksArmonk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 text-white/70 px-3.5 py-1.5 rounded-full hover:bg-red-600/10 hover:border-red-500/20 hover:text-white active:scale-97 transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe
            </a>
          </div>
        </div>
      </div>

      {/* Staff Access Bar */}
      <StaffAccessBar />

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="container py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} St. Patrick in Armonk · <a href="https://archny.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold/60 transition-colors">Archdiocese of New York</a> · <a href="https://www.ecatholic.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold/60 transition-colors">eCatholic</a> · <a href="https://www.vatican.va" target="_blank" rel="noopener noreferrer" className="hover:text-gold/60 transition-colors">Vatican</a>
          </p>
          <a href="https://www.astersports.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-[11px] text-white/40">powered by</span>
            <img src="/manus-storage/aster_logo_clean_854bf8b0.png" alt="Aster Sports" className="h-3.5 w-3.5 object-contain opacity-50" />
            <span className="text-[11px] font-medium text-white/50">Aster Sports</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
