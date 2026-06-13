import { Link } from "wouter";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-parish-green text-white">
      {/* Main Footer Content */}
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Church identity */}
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-serif text-base font-bold text-gold leading-tight">St. Patrick's Church</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
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
          </div>

          {/* Center: Quick links */}
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/mass-times" className="text-xs text-white/70 hover:text-gold transition-colors">Mass Times</Link>
            <Link href="/giving" className="text-xs text-white/70 hover:text-gold transition-colors">Giving</Link>
            <Link href="/bulletins" className="text-xs text-white/70 hover:text-gold transition-colors">Bulletin</Link>
            <Link href="/contact" className="text-xs text-white/70 hover:text-gold transition-colors">Contact</Link>
            <Link href="/faith-formation" className="text-xs text-white/70 hover:text-gold transition-colors">Faith Formation</Link>
          </nav>

          {/* Right: Stay connected buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://stpatarmonk.flocknote.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gold/15 border border-gold/30 text-gold px-3 py-1.5 rounded hover:bg-gold/25 transition-colors font-medium"
            >
              Flocknote
            </a>
            <a
              href="http://www.youtube.com/@StPatricksArmonk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-white/8 border border-white/15 text-white/70 px-3 py-1.5 rounded hover:bg-red-600/15 hover:border-red-500/25 hover:text-white transition-colors"
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
          <a href="https://www.astersports.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <span className="text-sm text-white/60">powered by</span>
            <img src="/manus-storage/aster_logo_clean_854bf8b0.png" alt="Aster Sports" className="h-7 w-7 object-contain" />
            <span className="text-sm font-bold text-gold">Aster Sports</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
