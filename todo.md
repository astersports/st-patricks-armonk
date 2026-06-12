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
