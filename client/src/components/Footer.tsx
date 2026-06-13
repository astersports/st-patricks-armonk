import { Link } from "wouter";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-parish-green text-white">
      <div className="container py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Church Info */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-gold">St. Patrick's Church</h3>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-gold/70" />
              <span>29 Cox Ave, Armonk NY 10504</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone className="w-3.5 h-3.5 shrink-0 text-gold/70" />
              <a href="tel:9142739724" className="hover:text-gold transition-colors">(914) 273-9724</a>
            </div>
          </div>

          {/* Essential Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
            <Link href="/mass-times" className="text-sm text-white/80 hover:text-gold transition-colors">Mass Times</Link>
            <Link href="/giving" className="text-sm text-white/80 hover:text-gold transition-colors">Giving</Link>
            <Link href="/bulletins" className="text-sm text-white/80 hover:text-gold transition-colors">Bulletin</Link>
            <Link href="/contact" className="text-sm text-white/80 hover:text-gold transition-colors">Contact</Link>
            <Link href="/faith-formation" className="text-sm text-white/80 hover:text-gold transition-colors">Faith Formation</Link>
          </div>

          {/* Stay Connected */}
          <div className="md:text-right space-y-3">
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">Stay Connected</h4>
            <div className="flex items-center gap-3 md:justify-end">
              <a
                href="https://stpatarmonk.flocknote.com/home"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm bg-gold/10 border border-gold/30 text-gold px-4 py-2 rounded-md hover:bg-gold/20 transition-colors"
              >
                Join Flocknote
              </a>
              <a
                href="https://www.youtube.com/@stpatricksarmonk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-red-600/80 transition-colors"
                aria-label="YouTube Channel"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Church of St. Patrick in Armonk · <a href="https://archny.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Archdiocese of New York</a>
          </p>
          <a href="https://astersports.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-xs text-white/40">powered by</span>
            <img src="/manus-storage/aster_sports_logo_66120ac0.png" alt="Aster Sports" className="h-4 w-4 object-contain" />
            <span className="text-xs font-medium text-gold/70">Aster Sports</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
