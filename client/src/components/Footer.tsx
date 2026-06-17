import { Link } from "wouter";
import { MapPin, Phone, Shield } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

function StaffAccessBar() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <div className="border-t border-white/[0.06]">
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
    <footer className="bg-parish-green text-white relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Footer Content */}
      <div className="container relative py-10 sm:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
          {/* Left: Church identity */}
          <div className="space-y-3 max-w-xs">
            <h3
              className="text-gold leading-tight"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.125rem",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              St. Patrick in Armonk
            </h3>
            <div className="flex flex-col gap-1.5 text-sm text-white/60" itemScope itemType="https://schema.org/CatholicChurch">
              <meta itemProp="name" content="St. Patrick Church" />
              <span className="flex items-center gap-2" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin className="w-3.5 h-3.5 text-gold/50 shrink-0" />
                <span><span itemProp="streetAddress">29 Cox Ave</span>, <span itemProp="addressLocality">Armonk</span> <span itemProp="addressRegion">NY</span> <span itemProp="postalCode">10504</span></span>
              </span>
              <a href="tel:9142739724" className="flex items-center gap-2 hover:text-gold transition-colors" itemProp="telephone">
                <Phone className="w-3.5 h-3.5 text-gold/50 shrink-0" />
                (914) 273-9724
              </a>
            </div>
            <p className="text-xs text-white/35 leading-relaxed pt-1">
              A welcoming Catholic community in northern Westchester County, serving families since 1924.
            </p>
          </div>

          {/* Center: Quick links - two columns */}
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2.5">
            <Link href="/mass-times" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">Mass Times</Link>
            <Link href="/giving" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">Giving</Link>
            <Link href="/news" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">News</Link>
            <Link href="/bulletins" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">Bulletin</Link>
            <Link href="/calendar" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">Calendar</Link>
            <Link href="/contact" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">Contact</Link>
            <Link href="/faith-formation" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">Faith Formation</Link>
            <Link href="/sacraments" className="text-sm text-white/60 hover:text-gold transition-colors duration-200">Sacraments</Link>
          </nav>

          {/* Right: Stay connected */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold">Stay Connected</p>
            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href="https://stpatarmonk.flocknote.com/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-gold/10 border border-gold/25 text-gold px-3.5 py-1.5 rounded-full hover:bg-gold/20 active:scale-[0.97] transition-all duration-200 font-bold"
              >
                Flocknote
              </a>
              <a
                href="http://www.youtube.com/@StPatricksArmonk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 text-white/70 px-3.5 py-1.5 rounded-full hover:bg-red-600/10 hover:border-red-500/20 hover:text-white active:scale-[0.97] transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Access Bar */}
      <StaffAccessBar />

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/35">
            © {new Date().getFullYear()} St. Patrick in Armonk · <a href="https://archny.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold/60 transition-colors">Archdiocese of New York</a> · <a href="https://www.ecatholic.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold/60 transition-colors">eCatholic</a> · <a href="https://www.vatican.va" target="_blank" rel="noopener noreferrer" className="hover:text-gold/60 transition-colors">Vatican</a>
          </p>
          <a href="https://www.astersports.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-[11px] text-white/35">powered by</span>
            <img src="/manus-storage/aster_logo_clean_854bf8b0.png" alt="Aster Sports" className="h-3.5 w-3.5 object-contain opacity-50" />
            <span className="text-[11px] font-medium text-white/45">Aster Sports</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
