import { Link } from "wouter";
import { Church, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-parish-green text-white">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Church className="w-6 h-6 text-gold" />
              <h3 className="font-serif text-xl font-bold">St. Patrick</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              A welcoming Catholic community in the heart of Armonk, New York.
            </p>
            <div className="flex items-start gap-2 text-sm text-white/80">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
              <span>29 Cox Ave, Armonk NY 10504</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone className="w-4 h-4 shrink-0 text-gold" />
              <span>(914) 273-9724</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold uppercase text-sm tracking-wider">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/mass-times" className="text-sm text-white/80 hover:text-gold transition-colors">Mass Times</Link>
              <Link href="/bulletins" className="text-sm text-white/80 hover:text-gold transition-colors">Weekly Bulletin</Link>
              <Link href="/news-events" className="text-sm text-white/80 hover:text-gold transition-colors">News & Events</Link>
              <Link href="/giving" className="text-sm text-white/80 hover:text-gold transition-colors">Online Giving</Link>
              <Link href="/contact" className="text-sm text-white/80 hover:text-gold transition-colors">Contact Us</Link>
            </nav>
          </div>

          {/* Mass Schedule */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold uppercase text-sm tracking-wider">Mass Schedule</h4>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium text-white">Saturday</p>
                  <p>5:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium text-white">Sunday</p>
                  <p>8:30 AM, 10:30 AM, 12:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium text-white">Weekdays (Tue–Fri)</p>
                  <p>8:30 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold uppercase text-sm tracking-wider">Office Hours</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p>Monday – Thursday</p>
              <p className="font-medium text-white">10:00 AM – 5:00 PM</p>
              <p className="mt-2">Friday</p>
              <p className="font-medium text-white">Closed</p>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold text-gold uppercase text-sm tracking-wider mb-2">Resources</h4>
              <nav className="flex flex-col gap-2">
                <a href="https://archny.org" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-gold transition-colors">Archdiocese of New York</a>
                <a href="https://stpatrickinarmonk.formed.org" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-gold transition-colors">FORMED</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Church of St. Patrick in Armonk. All rights reserved.
          </p>
          <p className="text-sm text-white/60">
            Part of the <a href="https://archny.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Archdiocese of New York</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
