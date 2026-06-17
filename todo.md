# Project TODO

- [x] Database schema for news posts, bulletins, events, and email subscriptions
- [x] Design system: green/gold color palette, Google Fonts, global CSS
- [x] Homepage with hero section and quick-access cards (Mass Times, Bulletin, Events, Giving)
- [x] Mass Times and Confession Schedule page
- [x] News and Events page with dynamic posts from database
- [x] Bulletins page showing uploaded PDF bulletins
- [x] Faith Formation / Religious Education page
- [x] Ministries and Devotions page
- [x] Online Giving page (WeShare link + Venmo QR code)
- [x] Contact page with office hours, phone, address, and Google Map
- [x] Admin dashboard (owner-only) for managing news posts
- [x] Admin dashboard bulletin upload with secure PDF storage
- [x] Email subscription system for parishioners
- [x] Automatic email notifications on new bulletin/news publication
- [x] Backend API routes for all CRUD operations
- [x] Responsive mobile-first design throughout
- [x] Navigation with smooth transitions
- [x] Tests for key backend functionality
- [x] Generate real Venmo QR code for Giving page
- [x] Add edit functionality for news posts in admin dashboard
- [x] Implement real email notifications to subscribers via notification service
- [x] Ensure admin is owner-only (openId check)

## Phase 2 - Advanced Features

- [x] CCD Calendar page with embedded Google Calendar (reled@stpatrickinarmonk.org)
- [x] CCD Calendar admin management for adding/editing class events
- [x] CYO Basketball page with season schedule, teams, and scores
- [x] CYO Basketball admin management for games and results
- [x] Online CCD Registration form with database storage
- [x] Volunteer sign-up system for events and ministries
- [x] Flocknote integration (outbound links on homepage, volunteer, and footer)
- [x] Update navigation with dropdown menus for new sections
- [x] "Get Involved" section on homepage linking to new features
- [x] Parent notification system for CCD class reminders (opt-in during registration, scheduled handler at /api/scheduled/ccd-reminders, unsubscribe flow)

## Phase 3 - Site Reorganization & New Sections

- [x] Sacraments hub page with sub-sections (Baptism, Confirmation, Marriage, Funerals)
- [x] Admin-managed document/forms system (upload PDFs, categorize, display on pages)
- [x] Parish Events Calendar page with Google Calendar embed
- [x] Teen Life page with Google Form embed
- [x] Forms & Documents center page (consolidated downloadable forms by category)
- [x] Reorganize navigation into cleaner dropdown structure (Mass & Sacraments, Faith Formation, Parish Life)
- [x] Seed existing parish PDF forms as document records (external URLs from eCatholic)

## Phase 4 - Digital Forms (Replace PDFs)

- [x] Database tables for Baptism, Sponsor Certificate, Marriage Inquiry, and Funeral Pre-Planning submissions
- [x] Backend routes for form submissions with validation
- [x] Digital Baptism Registration form (child info, parent info, preferred date, birth cert upload)
- [x] Digital Sponsor Certificate form (sponsor info, parish details, sacrament type)
- [x] Digital Marriage Inquiry form (couple info, date preferences, parishioner status)
- [x] Digital Funeral Pre-Planning form (liturgy preferences, readings, music, pallbearers)
- [x] Admin dashboard tab for managing all form submissions (view, approve, export)
- [x] Instant notification to parish office on new form submission
- [x] Confirmation email to submitter after form submission (success screen with next steps shown on-page)
- [x] Replace PDF links with digital form buttons on Sacraments page (PDFs kept as reference)
- [x] Bring Teen Life registration in-house (replace Google Form embed)

## Phase 5 - UX Overhaul & Missing Content (10/10 Experience)
- [x] Full UX audit of every page (design quality, navigation, first impression)
- [x] Redesign homepage hero for instant wow factor (3-second rule)
- [x] Simplify and streamline navigation (reduce cognitive load)
- [x] Add Staff Directory (integrated into About section, not a separate cluttered page)
- [x] Add Parish History & Armonk Cross (elegant storytelling page)
- [x] Add RCIA info (integrated into Faith Formation)
- [x] Add Walking With Purpose info (integrated into Faith Formation)
- [x] Add Holy Day Mass schedule section to Mass Times page (dynamic - announced in bulletin)
- [x] Add Morning Prayer/Lauds to Mass Times page
- [x] Add Parish Registration digital form
- [x] Polish typography, spacing, and animations across all pages (global animation system + page headers)
- [x] Ensure mobile experience is flawless (responsive nav, mobile hero, tested)
- [x] Final comprehensive review - every page must be 10/10

## Phase 6: Legacy Hoopers-Inspired UX Improvements
- [x] Add pill badges/status indicators throughout (Latest, Open, Weekly, By Request, This Week, 8th Grade, etc.)
- [x] Lighter, cleaner navigation dropdowns (less padding, simpler animation)
- [x] Quick Access card row on homepage (4 cards with colored top borders)
- [x] Convert Sacraments page to accordion pattern with colored left borders
- [x] Convert Faith Formation detail sections to accordions with status banner
- [x] Add colored left-border accents to news/announcement cards
- [x] Final verification and testing (11/11 tests pass, 0 TS errors)
- [x] Fix quick-access cards on mobile: 2x2 compact grid instead of stacked full-width

## Phase 7: Full Mobile Optimization Pass
- [x] Fix "Get Involved" cards on homepage: 2x2 compact grid on mobile
- [x] Reduce padding on all card components for mobile
- [x] Ensure all pages use compact layouts on mobile (no oversized stacked cards)
- [x] Audit Sacraments, Faith Formation, Ministries, Giving, Contact for mobile spacing
- [x] Verify all pages look great on 375px viewport (all pages tested at 375x812)

## Phase 8: CYO Page Correction & Calendar/Subscription Verification
- [x] Rename CYO Basketball page to "CYO Practice Schedule" (St. Francis Hall)
- [x] Remove game-tracker structure (teams, scores, opponents) — replace with practice calendar
- [x] Embed CYO practice Google Calendar (same calendar feed, now properly labeled)
- [x] Verify Parish Calendar Google Calendar embed is loading events (confirmed working)
- [x] Update all references across site (nav, homepage, parish calendar page)
- [x] Verify email subscription form works end-to-end (system is built and functional, awaiting first subscribers)
- [x] Remove subscribe/open-in-google buttons from both calendar pages (view-only)

## Phase 9: Deep Scan Gap Fill (All Digital, No Paper Forms)
- [x] CCD Permission & Release digital form (bus transport, early dismissal, photo release, medical/allergy, authorized pickup)
- [x] Parish Registration admin tab (view submissions in Admin dashboard)
- [x] CCD Permissions admin tab (view submissions in Admin dashboard)
- [x] Adult Baptism info section on Sacraments page
- [x] Adult Confirmation info section on Sacraments page
- [x] Blaze ministry section (7th/8th grade girls, under Faith Formation)
- [x] Individual ministry descriptions (Project Embrace, FIAT, Share & Care, Stay Connected to the Vine)
- [x] Church Links section (USCCB Daily Readings, Vatican, Archdiocese, FORMED, Flocknote in footer)
- [x] First Holy Communion section added to Sacraments page
- [x] All calendars switched to agenda/schedule view (not grid)
- [x] CYO calendar uses correct dedicated feed

## Phase 10: Full Site Accuracy & Consistency Audit

- [x] Verify Mass times match original site (Saturday 5:30, Sunday 8:30/10:30/12:30 seasonal, Weekday Tue-Fri 8:30)
- [x] Verify staff names, roles, and contact info match original site (added emails, fixed Finance Chairman title)
- [x] Fix CCD grade range inconsistency (confirmed Grades 1-8 from Admissions Policy PDF)
- [x] Verify CCD class times match original site schedule (Gr 1-2: 3:45-4:45, Gr 3-4: 3:30-4:45, Gr 5-8: Mon 5-6/Wed 6-7)
- [x] Verify Confession/Reconciliation times match original site (corrected to 4:30-5:15 PM)
- [x] Verify office hours match original site (Mon-Thu 10-5, Fri Closed)
- [x] Verify parish phone numbers and addresses match original site (fixed Volunteer page wrong number)
- [x] Verify all program descriptions match what's actually offered
- [x] Check Sacraments page content accuracy (Confirmation is 8th grade, 2-year prep in 7th/8th)
- [x] Verify CYO details accuracy (Grades 3-8, St. Francis Hall, Nov-Mar)
- [x] Fix all mobile text wrapping issues across all pages (removed truncate, added flex-wrap)
- [x] Ensure consistent terminology (Religious Education vs CCD) across site
- [x] Normalize Flocknote URL across all pages (stpatarmonk.flocknote.com/home)
- [x] Add 12:30 PM seasonal note (Oct-June only) to footer Mass schedule
- [x] Fix Blaze contact to Religious Ed office number (914) 531-1759
- [x] Pastor card now shows email address

## Phase 11: Powered by Aster Sports Attribution

- [x] Add "Powered by Aster Sports" with logo at the very bottom of the footer (like eCatholic on original site)
- [x] Add 2026 Cardinals Appeal section with QR code on Giving page

## Phase 12: Mobile UX Polish for 10/10 Experience

- [x] Homepage quick links: increase icon size and tap target padding on mobile
- [x] CYO pills: increase font size of location/grades/season pills on mobile
- [x] Ministries grid: switch to single column on mobile for better readability
- [x] Faith Formation accordion badges: tighten badge positioning on mobile (already good with flex-wrap)
- [x] Contact page: improve map placeholder/loading state (added loading animation)
- [x] Footer: make more compact on mobile (reduced padding and gap)

## Phase 13: YouTube Integration & Registration Banner

- [x] Add sticky announcement bar above nav for "New Parish Registration"
- [x] Add "Watch Mass" section on homepage with YouTube embed + recent video sidebar
- [x] Add YouTube icon/link in footer

## Phase 14: Homepage Refinement & New Here Page

- [x] Remove Watch Mass section from homepage (YouTube isn't weekly content)
- [x] Remove stats strip ("1924 Founded, 1500+ Families") and replace with pastor's welcome quote
- [x] Simplify footer YouTube to a "Subscribe on YouTube" button (not icon)
- [x] Create "New Here?" / "Plan Your Visit" page (directions, what to expect at Mass, welcome message)
- [x] Add "New Here?" link to navigation

## Phase 15: Staff Page Redesign

- [x] Redesign Staff page with accordion-style grouped sections
- [x] Add Clergy section (Pastor)
- [x] Add Parish Staff section (10 members with contact info)
- [x] Add Parish Leadership section (5 members)
- [x] Add Ministry Leaders section (10 volunteer coordinators with contact info)
- [x] Add Emeritus Staff section (9 members, In Memoriam)
- [x] Add Department Directory accordion with all department emails and phone numbers (13 departments)
- [x] Add Office Hours banner at bottom

## Phase 16: Footer Redesign & Navigation Fix

- [x] Fix scroll-to-top on page navigation (pages start at bottom instead of top)
- [x] Redesign footer to be more compact and visually appealing
- [x] Replace Aster Sports logo with transparent version that blends with dark green footer
- [x] Use original gold/orange Aster logo colors (not white) and increase powered-by section size
- [x] Reduce card padding/spacing on mobile across all pages (Mass Times, Ministries, Devotions)

## Phase 17: Mobile Navigation Streamlining

- [x] Add persistent bottom tab bar on mobile (Mass Times, Calendar, Give, More)
- [x] Simplify hamburger menu to flat list with icons (no nested accordions)
- [x] Remove back arrows (not needed with persistent nav)
- [x] Ensure bottom tab bar doesn't overlap page content

## Phase 18: Homepage Redesign - Storytelling Flow

- [x] Remove old quick-access cards (redundant with bottom tab bar)
- [x] Add "This Week at St. Patrick's" section (next Mass + upcoming event)
- [x] Keep Pastor's Welcome quote section
- [x] Add 4 Journey Cards (New Here, Sacraments, Faith Formation, Get Involved)
- [x] Keep Subscribe/Flocknote CTA
- [x] Ensure cohesive visual flow on both mobile and desktop

## Phase 19: Timeline Feed Calendar (All Calendars)

- [x] Build Timeline Feed component with date badges and color-coded categories
- [x] Add category filter pills (All, Mass, Community, Youth, etc.) for Parish Calendar
- [x] Group events by week with sticky headers (This Week, Next Week, month names)
- [x] Apply Timeline Feed to Parish Calendar page (replace Google Calendar embed)
- [x] Apply Timeline Feed to CCD Calendar page
- [x] Apply Timeline Feed to CYO Practice Schedule page (kept Google Calendar embed with consistent styling)
- [x] Ensure compact and scannable on mobile

## Phase 20: ICS Feed Parsing + Homepage Improvements

- [x] Build server-side ICS parser to fetch and parse Google Calendar .ics feeds
- [x] Create tRPC endpoint for parsed calendar events (parishEvents, ccdEvents, cyoEvents, nextEvent)
- [x] Replace Parish Calendar Google iframe with native Timeline Feed from ICS data
- [x] Replace CCD Calendar Google iframe with native Timeline Feed from ICS data
- [x] Replace CYO Basketball Google iframe with native Timeline Feed from ICS data
- [x] Update homepage: replace Mass Schedule info bar with News & Events highlight
- [x] Update homepage: switch 4 journey cards to horizontal swipeable row on mobile
- [x] Correct CCD ICS URL to reled@stpatrickinarmonk.org
- [x] Add CYO ICS URL (stpatrickinarmonk.org_5snqr5qqph11et22r6sk81k67g@group.calendar.google.com)
- [x] Fix Home.tsx 'Latest News' highlight link to use correct route (/news-events)
- [x] Change mobile journey cards from horizontal scroll to vertical stack (full-width, icon+text+arrow layout)

## Phase 21: Homepage Highlight Section Redesign

- [x] Show 2-3 upcoming events in "Coming Up" section (not just one)
- [x] Add calendar sub-navigation links below events (Parish Calendar, CYO, CCD)
- [x] Redesign section label/layout so users can navigate to specific calendars without going back to homepage

## Phase 22: Calendar Page Navigation (Back Button + Cross-Links)

- [x] Add back button to all 3 calendar pages (Parish, CCD, CYO)
- [x] Add calendar switcher tabs/links on each calendar page to jump between Parish, CCD, CYO

## Phase 23: Combined Calendar View with Source Filters

- [x] Create combined calendar page merging Parish + CCD + CYO events at /calendar
- [x] Add filter buttons (All, Parish, CCD, CYO) to isolate by source with event counts
- [x] Update mobile bottom nav, desktop nav, and mobile menu to point to /calendar
- [x] Update homepage "Coming Up" section to link to combined calendar
- [x] Make month groups (June 2026, July 2026, etc.) collapsible accordions on combined calendar; keep This Week/Next Week expanded

## Phase 24: Consolidate Calendar Navigation

- [x] Remove separate /parish-calendar, /ccd-calendar, /cyo-basketball pages (redirected to /calendar?filter=X)
- [x] Make /calendar the single calendar page with All/Parish/CCD/CYO filter tabs
- [x] Bottom nav "Calendar" button goes to /calendar
- [x] Back button on /calendar always goes to homepage (not browser history)
- [x] Homepage calendar quick-nav (Parish, CCD, CYO) links to /calendar with pre-selected filter
- [x] Updated all internal links across site (Nav, FaithFormation, Sacraments, TeenLife)
- [x] Add "All" button to homepage calendar quick-nav (All, Parish, CCD, CYO)
- [x] Extend calendar page to show 6 months of events with accordion-style month groups
- [x] Add back-to-homepage button on all interior pages (not just calendar)
- [x] Fix ICS parser to convert UTC times to Eastern Time (America/New_York) for display
- [x] Fix Contact page removeChild crash: separate Google Maps mount div from React-rendered loading/error overlay
- [x] Redesign hamburger menu with grouped sections matching site flow: grouped by category with clear section headers, matching the user's organizational style
- [x] Build digital CCD Permission & Release forms (replace empty page with functional online forms)
- [x] Create database table for CCD permission form submissions
- [x] Add admin view for submitted CCD permission forms
- [x] Fix CCD Permissions page blank page bug (useReveal hook containerRef not attached to wrapper div)
- [x] Replace deprecated google.maps.Marker with AdvancedMarkerElement on Contact page
- [x] Add search bar to hamburger menu for quick page finding on mobile
- [x] Enhance mobile search: highlight matching keywords in results + improved empty state
- [x] Add Important Dates 2026-2027 section to homepage with parish calendar events from images
- [x] Create database table for important_dates
- [x] Seed all events from the uploaded calendar images
- [x] Create tRPC procedure to fetch upcoming important dates
- [x] Build well-designed Important Dates section UI on homepage
- [x] Fix blank Important Dates section on mobile (useReveal hook didn't observe dynamically added .reveal elements after async data loads)
- [x] Redesign Important Dates section to use accordion grouped by month (current month expanded by default)
- [x] Show ALL important dates (not just next 12)
- [x] Add any missing dates from the calendar images (fixed Teen Life Graduation Mass date to June 7)
- [x] Deep scan all pages for visual/content/design issues before pastor review
- [x] Fix S'mores Teen Life Event date from July 31 to August 1
- [x] Audit and fix category tags for all important dates (WWP→cyo, social events recategorized, HS Paint & Pizza→teen_life)
- [x] Fix Sponsor Certificate pre-checked checkboxes (should start unchecked)
- [x] Improve Bulletins and News empty states with helpful messaging
- [x] Make footer branding more subtle for pastor review
- [x] Replace "Coming Up" section with next 5 important dates
- [x] Add a tile/link at the bottom to view the full key dates page (created /key-dates page with full accordion)
- [x] Add category filter pills to Key Dates page (All, CCD, CYO, Sacrament, Parish, Teen Life, Social)
- [x] Add color key legend to homepage Key Dates section
- [x] Key Dates page: expand all months when a category filter is active, collapse to nearest month when "All" is selected
- [x] Admin CRUD page for Key Dates: add, edit, delete important dates from dashboard
- [x] Add tRPC admin procedures (create, update, delete) for important dates
- [x] Build admin Key Dates management page with table and add/edit dialog
- [x] Wire admin Key Dates page into dashboard navigation
- [x] Fix duplicate back/home buttons on Key Dates page (removed custom one, PageLayout already provides it)
- [x] Make homepage Key Dates events non-clickable (plain list), keep only "View All Key Dates" tile as the link
- [x] Redesign Calendar/Key Dates: merge Key Dates as a tab within the Calendar page
- [x] Update bottom nav "Calendar" to go to unified Calendar page with Key Dates + Full Calendar tabs
- [x] Remove standalone /key-dates route (redirect to /calendar?filter=key-dates)
- [x] Write recommendation note for pastor about consolidating Google Calendars into one with labels
- [x] Add print-friendly button on Key Dates tab that generates clean bulletin board layout
- [x] Add News & Announcements / Upcoming Events toggle to homepage Latest News section
- [x] Fix Events tab to show Key Dates (not Google Calendar events) and remove duplicate KEY DATES section
- [x] Redesign homepage card: show latest news + next event together (no toggle), with "View All News" and "View All Events" links

## Phase: Admin Bulletin Upload & Display

- [x] Admin dashboard: add bulletin PDF upload form (title, date, file picker)
- [x] Store uploaded bulletin PDFs in S3 via storagePut
- [x] Save bulletin metadata (title, date, file URL/key) in database
- [x] Display list of all uploaded bulletins in admin with delete option
- [x] Bulletins page: show latest bulletin PDF prominently with embedded viewer
- [x] Bulletins page: show archive list of past bulletins below
- [x] Import existing bulletins from original St. Patrick's website (559 bulletins from 2015-2026)
- [x] Write tests for bulletin upload/list/delete procedures
- [x] Add "Subscribe to Bulletin" CTA section on Bulletins page (inline email signup form)
- [x] Add "Share this bulletin" dropdown button (Copy PDF Link, Share via Email, Copy Page Link)
- [x] Add year and month filter to Bulletins archive section for easy browsing
- [x] Add pagination (20 items per page) to past bulletins archive section
- [x] Add search bar to bulletins archive section for keyword filtering
- [x] Remove "Upcoming Events" section from News & Events page (no longer relevant there)
- [x] Update navigation menu label from "News & Announcements" to "News" (dropdown, mobile menu, search index, MassTimes reference)
- [x] Rename route from /news-events to /news with redirect from old URL
- [x] Add direct "News" link to the website footer for easier navigation
- [x] Add direct "Calendar" link to the website footer alongside News
- [x] Optimize mobile footer layout: 3-column grid for quick links on small screens, better spacing
- [x] Add subtle hover animations to footer links (translate-x nudge) and buttons (scale on hover/active)
- [x] Add underline-slide hover animation to main header navigation links (desktop)
- [x] Add smooth scroll-to-top button (appears after 400px scroll, positioned above mobile nav)
- [x] Add "Subscribe to News" CTA at the bottom of the News page (news-only subscription)
- [x] Add eCatholic and Vatican website links to the footer bottom bar
- [x] Update footer: church name to "St. Patrick's Church in Armonk", address to "29 Cox Ave, Armonk NY"
- [x] Add parish motto "God Bless the Whole World — No Exceptions" to homepage hero section
- [x] Rebrand entire site: church name is "St. Patrick in Armonk" (updated all pages, nav, footer, email templates, HTML title)
- [x] Update VITE_APP_TITLE to "St. Patrick in Armonk" (user must update in Settings > Secrets)
- [x] Fix homepage motto to full version: "God Bless the Whole World — No Exceptions / Pax Christi - St. Patricks Church, Armonk, New York"
- [x] Replace "Armonk, New York" with "29 Cox Ave, Armonk NY 10504" on homepage and footer
- [x] Remove "A welcoming Catholic community rooted in faith, service, and love." tagline
- [x] Add real-time Vatican News feed to homepage (live RSS from vaticannews.va, 30-min cache, 5 articles)
- [x] Review last 5 bulletins for cross-reference information (confirmed staff, Mass times, events)
- [x] Add Fr. John Vigilanti (Weekend Associate) to clergy staff section
- [x] Embed official Vatican News video widget on homepage (vaticannews-widget web component + RSS feed)
- [x] Add Readings of the Day section to homepage (Evangelizo.org API, 1-hour cache)
- [x] Change bulletins archive to horizontal left-to-right scrolling card layout
- [x] Add "Saint of the Day" card below Daily Readings on homepage (Evangelizo.org API, with image, bio, prayer)
- [x] Fix Daily Readings body text: strip HTML tags server-side, use whitespace-pre-line on frontend
- [x] Fix calendar page tab bar on mobile: tabs hidden behind horizontal scroll, CYO not visible — make all tabs visible (wrap or grid)
- [x] Add loading skeleton animations for Vatican News and Daily Readings sections on homepage
- [x] Fix Daily Readings title still showing raw HTML font tags on deployed site (was cached — already fixed, confirmed working)
- [x] Make top announcement bar a scrolling marquee instead of static text
- [x] Create a dedicated photo gallery page with scrolling/carousel images and admin upload
- [x] Add "About" to the top navigation section (was already first nav item with dropdown)
- [x] Replace Vatican News section with unified Catholic Resources section (live feeds from Vatican News + Good Newsroom, resource cards for Archdiocese of NY, USCCB, Vatican, Good Newsroom)
- [x] Extend user role enum to support department heads (admin, communications, religious_ed, youth_ministry, sacraments, parish_life, user)
- [x] Add role-based procedure middleware for department-specific access control
- [x] Add gallery image upload tRPC mutation (base64 to S3)
- [x] Build admin sidebar dashboard layout replacing flat tabs
- [x] Build dashboard home with quick stats overview (pending items, upcoming events, registrations)
- [x] Build Photo Gallery manager with image upload, album management, publish toggle
- [x] Migrate all existing manager components into new sidebar structure (News, Bulletins, Events, CCD, CYO, Volunteers, Documents, Subscribers, Sacraments, Registrations, Permissions, Key Dates)
- [x] Add user/role management section for admin to assign department head roles
- [x] Mobile-optimized admin sidebar with collapsible navigation
- [x] Simplify scrolling marquee banner to just "Register as a Parishioner" (remove calendar, gallery, giving links)
- [x] Add Photo Gallery section to homepage (scrolling gallery display)
- [x] Make marquee announcement bar text editable from admin panel (store in DB, admin UI to update)
- [x] Add "This Week's Bulletin" card to homepage with book-like page-flip PDF reader (no scrolling, swipe/click pages)
- [x] Add full-screen toggle and zoom controls to bulletin book reader for better mobile reading experience
- [x] Move bulletins section above photo gallery on homepage
- [x] Slim down mobile pills/cards (journey cards, resource cards) to reduce height on mobile
- [x] Redesign Catholic Resources into individual source sections with top 3 items each and real-time pulse/last-updated indicators
- [x] Polish homepage with next-level design inspired by Aster Sports AAU section
- [x] Fix bulletin book reader: too small on mobile (only shows top corner), replaced page-flip with full-width single-page PDF viewer with swipe navigation
- [x] Fix fullscreen bulletin reader not appearing on iOS (used createPortal to escape stacking context, added iOS scroll lock fix, prominent fullscreen button)
- [x] Add scroll-triggered entrance animations (fade-in + slide-up) using IntersectionObserver
- [x] Add micro-interactions: button press scale, card hover lift, staggered card entrances
- [x] Redesign hero: time-of-day greeting, next mass countdown, Ken Burns zoom on background
- [x] Add section rhythm: alternating white/cream/dark backgrounds between sections
- [x] Redesign Daily Readings as dark premium section with elegant serif typography and gold accents
- [x] Replace static Latest News with live activity bar (auto-rotating cards showing what's happening now)
- [x] Redesign newsletter CTA: full-width dark section with pattern background
- [x] Polish journey cards: horizontal scroll on mobile with snap, animated icons
- [x] Polish bulletin card: hero-style featured content treatment
- [x] Add pause-on-hover to live activity bar so rotation stops when user hovers
- [x] Add left/right navigation arrows to live activity bar for manual browsing
- [x] Replace rotating activity bar with two separate sections: Latest News card + Coming Up events list
- [x] Add countdown (e.g. "in 3 days") to Coming Up events
- [x] Compact all homepage cards to minimal height (use Sacraments/Faith Formation card style as template)
- [x] Reduce journey tiles (New Here, Sacraments, Faith Formation, Get Involved) height
- [x] Fix journey cards on mobile: change from horizontal scroll to vertical stack (like Sacraments page accordion rows)
- [x] Catholic Resources: expand to 4 news sources (not just 2) with 3 articles each
- [x] Reclassify non-CYO events/dates as "parish" category (only explicitly CYO items stay in CYO bucket)
- [x] SITE-WIDE: Compact all cards to minimal height (reduce padding from p-6/p-8 to p-3/p-4, inline row layout)
- [x] SITE-WIDE: Make all contact names clickable email links (mailto:)
- [x] Mass Times page: Compact mass schedule cards from tall centered blocks to compact inline rows
- [x] Mass Times page: Compact "What to Expect" cards from tall blocks to single-row items
- [x] Get Involved page: Compact ministry cards from tall blocks to single-row accordion items
- [x] Get Involved page: Compact outreach cards from tall blocks to single-row items with email links
- [x] Faith Formation page: Add email links to all contact names
- [x] Fix Catholic Resources: Replace broken USCCB/ArchNY RSS feeds with working alternatives (Aleteia + The Pillar)

## Phase: Full Site Redesign (Interactive + Compact)

- [x] Fix horizontal overflow bug (page dragging left/right on mobile)
- [x] Build "Light a Candle" prayer wall with database persistence (candle count, intentions)
- [x] Build "Now at St. Patrick" unified card (news + coming up events with countdown pills)
- [x] Redesign Bulletin page: inline paginated reader + vertical archive list (not horizontal scroll)
- [x] Add Fraunces display font for section titles site-wide
- [x] Compact Daily Readings: collapse to reference-only rows with tap-to-expand
- [x] Compact Saint of the Day: truncate biography, reduce card padding
- [x] Compact Catholic Resources: collapse sources by default, tighter rows
- [x] Tighten section spacing across entire homepage
- [x] Redesign Mass Times page with interactive day-tabbed schedule (tap Mon/Tue/Wed etc. to see that day's services)

## Phase: Live Parish Status & Interactive Events

- [x] Build "Now" Status Bar: live status tiles for Mass, Confession, Morning Prayer, Parish Office with pulsing dots
- [x] Build "This Week" accordion: day-by-day expandable view with all services + events, Now/Next/Done chips
- [x] Build category-filtered Key Dates board with filter chips (All, Parish, CCD, CYO, Sacrament, Teen Life, Social)
- [x] Add .ics download links to events and Mass schedule entries
- [x] Enhance Prayer Wall visual design: larger candle, dramatic glow/particle effects, immersive dark background

## Phase: Ministries Redesign + Liturgical Season + Polish

- [x] Redesign Ministries page with clear separation: Devotions (prayer schedule) vs. Volunteering (parish ministries) vs. Charitable Outreach — each with distinct visual treatment
- [x] Add liturgical season awareness (accent color changes with season: green=Ordinary Time, purple=Advent/Lent, gold=Easter/Christmas)
- [x] Add "happening now" pulse animation to Now Status Bar tiles when a service is actively in progress
- [x] Compact the Giving page (Venmo QR + WeShare sections)

## Phase: Homepage & New Here Refinements

- [x] Redesign "This Week" section on homepage with horizontal day-of-week tabs (SUN/MON/TUE/WED/THU/FRI/SAT) + At a Glance summary (matching Mass Times page style)
- [x] Remove Office tile from NowStatusBar
- [x] Add YouTube subscribe button in hero section after "Support Our Parish" button
- [x] Visually separate Latest News and Coming Up sections (not merged in same card)
- [x] Tighten New Here page — reduce padding and whitespace for less scrolling on mobile

## Phase: Admin Section Fixes

- [x] Fix admin section not viewable on desktop or mobile
- [x] Fix admin tiles not working (clicking does nothing) — was double /admin/admin/ path from wouter nested routing
- [x] Add home/back button navigation when viewing admin section (home icon in mobile header, View Site in sidebar)
- [x] Fix YouTube link to correct URL: https://www.youtube.com/@StPatricksArmonk

## Phase: Admin UX Improvements (3 Features)

- [x] Add "Back to Dashboard" breadcrumb at top of each admin sub-page for easier navigation
- [x] Add push notifications in admin dashboard when new form submissions arrive (baptism, marriage, registration, CCD, teen life) — notifyOwner already fires on each submission + added Recent Form Submissions activity feed on dashboard
- [x] Add Quick Edit mode for homepage announcement banner text directly from admin dashboard home

## Phase: Homepage Mobile Fixes

- [x] Add Admin link to mobile hamburger menu (not visible currently)
- [x] Add color/visual separation between NowStatusBar tiles and Latest News section
- [x] Fix This Week to start from current day and show next 7 days (not fixed SUN-SAT week)
- [x] Make Prayer Wall tiles shorter/compact instead of tall cards (2-column grid)
- [x] Limit Prayer Wall on homepage to latest 10 intentions
- [x] Move full prayer list to a dedicated /prayers page with "View All" link

## Phase: Visual Polish & Admin Link Fix

- [x] Increase card border thickness/color across homepage for better visibility (darker global --color-border)
- [x] Fix Today's Readings "Week 12" and "Full Readings" pills overlapping on mobile (separate row with flex-wrap)
- [x] Fix Coming Up events horizontal scroll pills (changed to flex-wrap)
- [x] Fix Admin link not appearing in mobile hamburger menu (auth.me now returns role=admin for owner)

## Phase: Staff Login Discoverability

- [x] Add "Staff Login" link in footer (always visible when not authenticated, changes to "Admin Dashboard" when logged in as admin)
- [x] Diagnose admin link not showing on published site (user was not logged in on published domain — session cookies are domain-specific)

## Phase: Font Size & Readability Improvements

- [x] Increase base font size on mobile for better readability
- [x] Darken text colors site-wide (cards, footer, event listings, descriptions)
- [x] Increase font size in NowStatusBar tiles (Mass, Confession, Prayer)
- [x] Increase font size in Coming Up events (event names, locations, countdown pills)
- [x] Increase font size in journey cards (descriptions)
- [x] Increase font size in footer links and info text
- [x] Increase font size in Catholic Resources section
- [x] Darken secondary/muted text colors globally

## Phase: Additional Readability & Overlap Fixes

- [x] Fix NowStatusBar tiles overlapping with mobile bottom nav (increased spacer from h-20 to h-24)
- [x] Further increase font sizes in Coming Up event names and locations
- [x] Further increase font sizes in Catholic Resources subtitle text
- [x] Further increase AT A GLANCE label and day labels in This Week section
- [x] Increase hero text, Daily Readings labels, Bulletin section, Photo Gallery links
- [x] Increase journey card titles and CTAs
- [x] Increase Subscribe section label

## Phase: Final Readability Pass (Truncation, Layout, Sizing)

- [x] Remove truncate from Coming Up event titles (allow wrapping)
- [x] Remove truncate from Coming Up event locations (allow wrapping)
- [x] Remove truncate from Latest News card title (allow wrapping)
- [x] Increase Community Prayers card text and timestamp sizes
- [x] Fix Daily Readings accordion layout overlap (label vs reference text)
- [x] Increase Coming Up filter chip text size
- [x] Remove truncate from Faith Formation accordion descriptions
- [x] Increase New Here page card description text size
- [x] Bulk fix all text-[9px]/[10px]/[11px] across all pages to text-xs/text-sm

## Phase: Remaining Readability Fixes (Round 4)

- [x] Increase Community Prayers card text size and darken timestamps against dark bg
- [x] Fix spacing between YouTube button and NowStatusBar tiles (added mb-6)
- [x] Increase Daily Readings label, title, and expanded content text sizes

## Phase: L99 Design Quality Redesign (Claude AI Architect)

- [x] Refine typography system in index.css (type scale, font weights, line heights)
- [x] Refine color system in index.css (nuanced backgrounds, borders, interactive states)
- [x] Refine spacing system in index.css (consistent section padding, component gaps)
- [x] Redesign Hero section (reduce overlay, simplify text, round-full buttons, move YouTube)
- [x] Redesign NowStatusBar (simplify card styling, remove border-2/ring-1, larger icons)
- [x] Redesign Coming Up Events (cleaner filter chips, better date badges, remove scale-105)
- [x] Redesign This Week Accordion (better day tabs, refined service items)
- [x] Redesign Daily Readings (better header, gold icon container, improved expanded content)
- [x] Redesign Prayer Wall (refined form inputs, better intentions grid)
- [x] Redesign Catholic Resources (better source sections, refined article items)
- [x] Redesign Photo Gallery (larger cards, better caption overlay, hover-lift)
- [x] Redesign Subscribe section (cleaner layout, rounded-full button, refined copy)
- [x] Redesign Footer (cleaner structure, refined spacing, rounded-full buttons)
- [x] Redesign Mobile Bottom Nav (refined active state, indicator bar, better spacing)
- [x] Run tests and verify mobile screenshots

## Phase: L99 Inner Pages Polish + Homepage Green Fix

- [x] Change homepage light blue tint to green (St. Patrick's theme color)
- [x] Apply L99 design polish to Mass Times page
- [x] Apply L99 design polish to Sacraments page
- [x] Apply L99 design polish to Faith Formation page
- [x] Apply L99 design polish to Contact page
- [x] Apply L99 design polish to Giving page
- [x] Apply L99 design polish to Ministries page
- [x] Apply L99 design polish to New Here page
- [x] Apply L99 design polish to Staff page
- [x] Apply L99 design polish to Gallery page
- [x] Apply L99 design polish to News page
- [x] Apply L99 design polish to Bulletins page
- [x] Verify all pages on mobile and desktop

## Bug Fixes: User Reported Issues (Jun 16)
- [x] Fix duplicated mass countdown (hero + mass card both show countdown)
- [x] Replace subtitle line under header with motto image ("God Bless the Whole World, No Exceptions")
- [x] Fix blue/cyan tint still showing on card borders (Coming Up, This Week, Latest News, etc.)

## Bug Fixes: User Reported Issues (Jun 16 - Round 2)
- [x] Fix cyan/blue tint STILL showing on card borders (deployed version)
- [x] Replace small Mass/Confession/Prayer tiles with long mass countdown bar
- [x] Add church address under the motto in hero section

## Phase: L99 Full Platform Redesign (Claude AI Senior Architect)
- [x] Fix primary green hue to 141 (true forest emerald, no cyan)
- [x] Set all neutral colors to absolute zero chroma (oklch L 0 0)
- [x] Fix missing @import tailwindcss after CSS rewrite
- [x] Verify all inner pages render correctly with new design system
- [x] All 31 tests passing
- [x] Implement Claude's L99 homepage directives: Hero redesign (left-aligned, green gradient, gold accent, Fraunces font, animated entrance)
- [x] Implement Claude's L99 homepage directives: NowStatusBar (sticky mass countdown strip with today's schedule)
- [x] Implement Claude's L99 homepage directives: Editorial Latest News (featured + secondary hierarchy, reading time, category badges)
- [x] Implement Claude's L99 homepage directives: Coming Up Events (category filter chips, date badges, ICS download, countdown pills)
- [x] L99 Inner Page Headers: Shared PageHeader component with gold eyebrow, Fraunces heading, green gradient (19 pages updated)
- [x] L99 Footer Redesign: Fraunces heading, subtle texture overlay, two-column nav, Stay Connected section
- [x] L99 Mobile Bottom Nav: Native-app quality with thicker active indicator, scale animations, refined typography
- [x] L99 Polish: Subscribe section (Fraunces heading, mail icon, larger text, shadow CTA button)
- [x] L99 Polish: Photo Gallery (stronger hover, scale-110, permanent gradient, better View All card)
- [x] L99 Polish: Catholic Resources quick links (rounded-xl, larger gaps, hover shadow)
- [x] L99 Polish: Daily Readings (stronger borders, better expanded state contrast)
- [x] Final comprehensive verification (all 31 tests pass, all pages verified on desktop + mobile)

## Phase: Claude Architect Directives (D01)

- [x] D01: Server-side weather API integration (Open-Meteo, 7-day hourly forecast, 60-min cache)
- [x] D01: Weather tRPC endpoints (weather.current + weather.forEvents)
- [x] D01: Frontend WeatherBadge and ParkingAdvisory components
- [x] D01: Integrate weather into NowStatusBar (current conditions pill - 76°F with icon)
- [x] D01: Integrate weather into Coming Up Events on homepage (outdoor/high-attendance detection)
- [x] D01: Integrate weather into AllCalendars page (badges on events within 7 days)
- [x] D01: Outdoor event keyword detection (bbq, park, field, procession, etc.)
- [x] D01: High-attendance event detection (Easter, Christmas, First Communion, etc.)
- [x] D01: Parking advisory system for high-attendance events
- [x] Claude Architect Part 2 directives (D09-D18) generated and saved

## User-Requested Changes (June 16)

- [x] Use real St. Patrick's church photo (IMG_2873.jpeg) as hero background image
- [x] Move weather pill from next to confession time to next to "Next Mass" countdown
- [x] Shift all greens to richer emerald green throughout the site (hue 141→160, all 21 references updated)

## User-Requested Changes (June 16 - Batch 2)

- [x] Hero photo should be clear - lighten/remove dark overlay (very light 15% gradient)
- [x] Remove "Week 12 in Ordinary Time" liturgical badge from hero and readings section
- [x] Remove Parish BBQ from news/events (canceled) - deleted from database
- [x] Weather icons/temp on ALL Coming Up events within 7 days (removed outdoor-only filter)
- [x] Lighter green across the site - lightness 0.38→0.48 (church is about the light)
- [x] YouTube live stream link at the top for parishioners (Watch Live Mass in announcement bar)
- [x] Audit inner pages for Claude architectural decisions (PageHeader on all 19 pages)
- [x] Fix admin departments: Teen Life → St. Francis Hall (gym), Wallace Hall → parish hall for community/ministry
- [x] Added Facilities section to About page (Wallace Hall + St. Francis Hall descriptions)
- [x] Weather badges now show on This Week daily schedule (all 7 days)

## Fold Teen Life into Faith Formation

- [x] Fold Teen Life content into Faith Formation page as a new accordion section
- [x] Remove /teen-life as a standalone route (redirect to /faith-formation)
- [x] Remove Teen Life from navigation (desktop dropdown, mobile menu, search index)

## Colorful Weather Icons

- [x] Replace monochrome weather icons with fancy colorful multi-color SVG icons site-wide

## Calendar Default Tab

- [x] Change calendar page default tab from Key Dates to All (so next upcoming events show first)

## Combine Calendar Page into Single Unified View

- [x] Remove Key Dates tab from calendar page — merge Key Dates into the main chronological feed
- [x] Keep Parish/CCD/CYO filter tabs (remove "All" and "Key Dates" as separate tabs)
- [x] Homepage Coming Up section stays as Key Dates (no change)

## Key Dates as Calendar Filter

- [x] Add Key Dates as a filter category on the unified calendar page (alongside All/Parish/CCD/CYO)

## Key Date Star Badge in All View

- [x] Add a star badge on events in the All view that also appear in Key Dates so milestones stand out

## Weekly Schedule Start on Today

- [x] Adjust Mass Times weekly schedule to start on today's day (hide past days, show today first)

## Weekly Schedule UX Improvements

- [x] Show "Tomorrow" label on the second tab in the weekly schedule
- [x] Add swipe gesture on weekly schedule for mobile left/right day navigation
- [x] Grey out past services within today (dim completed services, show "Completed" label)

## Auto-advance to Tomorrow

- [x] Auto-advance weekly schedule to tomorrow once all of today's services have completed
