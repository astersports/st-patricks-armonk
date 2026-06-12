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
