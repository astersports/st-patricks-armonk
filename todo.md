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
