import { Link } from "wouter";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-parish-green text-white">
      {/* Main Footer Content */}
      <div className="container py-6 sm:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-4">
          {/* Left: Church identity */}
          <div>
            <h3 className="font-serif text-base font-bold text-gold leading-tight">St. Patrick's Church</h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold/60" />
                29 Cox Ave, Armonk NY 10504
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <a href="tel:9142739724" className="flex items-center gap-1 hover:text-gold transition-colors">
                <Phone className="w-3 h-3 text-gold/60 sm:hidden" />
                (914) 273-9724
              </a>
            </div>
          </div>

          {/* Center: Quick links - grid on mobile for clear layout */}
          <nav className="grid grid-cols-3 gap-x-6 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-1.5">
            <Link href="/mass-times" className="text-xs text-white/70 hover:text-gold hover:translate-x-0.5 transition-all duration-200 ease-out">Mass Times</Link>
            <Link href="/news" className="text-xs text-white/70 hover:text-gold hover:translate-x-0.5 transition-all duration-200 ease-out">News</Link>
            <Link href="/calendar" className="text-xs text-white/70 hover:text-gold hover:translate-x-0.5 transition-all duration-200 ease-out">Calendar</Link>
            <Link href="/giving" className="text-xs text-white/70 hover:text-gold hover:translate-x-0.5 transition-all duration-200 ease-out">Giving</Link>
            <Link href="/bulletins" className="text-xs text-white/70 hover:text-gold hover:translate-x-0.5 transition-all duration-200 ease-out">Bulletin</Link>
            <Link href="/contact" className="text-xs text-white/70 hover:text-gold hover:translate-x-0.5 transition-all duration-200 ease-out">Contact</Link>
            <Link href="/faith-formation" className="text-xs text-white/70 hover:text-gold hover:translate-x-0.5 transition-all duration-200 ease-out col-span-2 sm:col-span-1">Faith Formation</Link>
          </nav>

          {/* Right: Stay connected buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://stpatarmonk.flocknote.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gold/15 border border-gold/30 text-gold px-3 py-1.5 rounded hover:bg-gold/25 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 ease-out font-medium"
            >
              Flocknote
            </a>
            <a
              href="http://www.youtube.com/@StPatricksArmonk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-white/8 border border-white/15 text-white/70 px-3 py-1.5 rounded hover:bg-red-600/15 hover:border-red-500/25 hover:text-white hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 ease-out"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} Church of St. Patrick in Armonk · <a href="https://archny.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold/60 transition-colors">Archdiocese of New York</a>
          </p>
          <a href="https://www.astersports.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-[11px] text-white/40">powered by</span>
            <img src="/manus-storage/aster_logo_clean_854bf8b0.png" alt="Aster Sports" className="h-4 w-4 object-contain opacity-60" />
            <span className="text-[11px] font-medium text-white/50">Aster Sports</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
