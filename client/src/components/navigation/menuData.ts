/**
 * Navigation Menu Data — All nav links, searchable pages, and mobile menu sections.
 */

import { Clock, BookOpen, Users, Heart, Calendar, FileText, GraduationCap, Newspaper, Phone, UserPlus, HandHeart, Cross, Church, Search } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const navLinks: NavItem[] = [
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "Our Parish" },
      { href: "/new-here", label: "New Here? Plan Your Visit" },
      { href: "/staff", label: "Staff & Leadership" },
      { href: "/parish-registration", label: "New Parishioner Registration" },
    ],
  },
  {
    href: "/mass-times",
    label: "Mass & Prayer",
    children: [
      { href: "/mass-times", label: "Mass Times & Confession" },
      { href: "/sacraments", label: "Sacraments" },
    ],
  },
  {
    href: "/faith-formation",
    label: "Faith Formation",
    children: [
      { href: "/faith-formation", label: "Overview" },
      { href: "/calendar?filter=ccd", label: "CCD Calendar" },
      { href: "/ccd-registration", label: "CCD Registration" },
      { href: "/ccd-permissions", label: "CCD Permission Forms" },
    ],
  },
  {
    href: "/news",
    label: "Parish Life",
    children: [
      { href: "/news", label: "News" },
      { href: "/calendar", label: "Full Calendar" },
      { href: "/gallery", label: "Photo Gallery" },
      { href: "/bulletins", label: "Weekly Bulletins" },
      { href: "/calendar?filter=cyo", label: "CYO Schedule" },
      { href: "/ministries", label: "Ministries & Devotions" },
      { href: "/volunteer", label: "Volunteer" },
      { href: "/forms", label: "Forms & Documents" },
    ],
  },
  { href: "/giving", label: "Giving" },
  { href: "/contact", label: "Contact" },
];

// Searchable page index — includes all pages with keywords for fuzzy matching
export type SearchableItem = { href: string; label: string; keywords: string[]; icon: typeof Clock };

export const searchablePages: SearchableItem[] = [
  { href: "/mass-times", label: "Mass Times & Confession", keywords: ["mass", "confession", "reconciliation", "schedule", "saturday", "sunday", "weekday", "holy day", "prayer", "lauds"], icon: Clock },
  { href: "/sacraments", label: "Sacraments", keywords: ["baptism", "confirmation", "marriage", "wedding", "funeral", "communion", "eucharist", "sponsor", "rcia", "anointing"], icon: Cross },
  { href: "/faith-formation", label: "Faith Formation", keywords: ["faith", "formation", "religious education", "rcia", "walking with purpose", "blaze", "adult"], icon: GraduationCap },
  { href: "/calendar?filter=ccd", label: "CCD Calendar", keywords: ["ccd", "religious ed", "class", "schedule", "catechism"], icon: Calendar },
  { href: "/ccd-registration", label: "CCD Registration", keywords: ["ccd", "register", "enroll", "religious ed", "sign up", "child"], icon: FileText },
  { href: "/ccd-permissions", label: "CCD Permission Forms", keywords: ["ccd", "permission", "release", "bus", "medical", "allergy", "pickup", "dismissal", "photo"], icon: FileText },
  { href: "/faith-formation", label: "Teen Life & Youth Ministry", keywords: ["teen", "youth", "high school", "confirmation", "young", "teen life"], icon: Users },
  { href: "/news", label: "News", keywords: ["news", "announcement", "update", "parish"], icon: Newspaper },
  { href: "/calendar", label: "Full Calendar", keywords: ["calendar", "events", "schedule", "upcoming", "parish", "cyo", "ccd", "full"], icon: Calendar },
  { href: "/bulletins", label: "Weekly Bulletins", keywords: ["bulletin", "weekly", "pdf", "download", "read"], icon: BookOpen },
  { href: "/calendar?filter=cyo", label: "CYO Schedule", keywords: ["cyo", "basketball", "sports", "practice", "youth", "athletics"], icon: Calendar },
  { href: "/ministries", label: "Ministries & Devotions", keywords: ["ministry", "devotion", "lector", "eucharistic", "choir", "music", "rosary", "prayer", "share care", "fiat", "embrace"], icon: HandHeart },
  { href: "/volunteer", label: "Volunteer", keywords: ["volunteer", "help", "serve", "sign up", "get involved"], icon: Users },
  { href: "/forms", label: "Forms & Documents", keywords: ["form", "document", "download", "pdf", "application"], icon: FileText },
  { href: "/giving", label: "Give Online", keywords: ["give", "donate", "offering", "weshare", "venmo", "tithe", "stewardship", "cardinal", "appeal"], icon: Heart },
  { href: "/contact", label: "Contact Us", keywords: ["contact", "phone", "email", "address", "office", "hours", "directions", "map"], icon: Phone },
  { href: "/gallery", label: "Photo Gallery", keywords: ["photo", "gallery", "pictures", "images", "events", "album"], icon: Church },
  { href: "/about", label: "Our Parish", keywords: ["about", "parish", "history", "armonk", "cross", "community"], icon: Church },
  { href: "/new-here", label: "New Here? Plan Your Visit", keywords: ["new", "visit", "welcome", "first time", "directions", "what to expect"], icon: UserPlus },
  { href: "/staff", label: "Staff & Leadership", keywords: ["staff", "pastor", "priest", "deacon", "director", "leadership", "team", "contact"], icon: Users },
  { href: "/parish-registration", label: "Register as a Parishioner", keywords: ["register", "new member", "join", "parishioner", "sign up", "family"], icon: UserPlus },
];

// Grouped mobile menu matching site flow
export type MobileMenuSection = {
  title: string;
  items: { href: string; label: string; icon: typeof Clock }[];
};

export const mobileMenuSections: MobileMenuSection[] = [
  {
    title: "Worship",
    items: [
      { href: "/mass-times", label: "Mass Times & Confession", icon: Clock },
      { href: "/sacraments", label: "Sacraments", icon: Cross },
    ],
  },
  {
    title: "Faith Formation",
    items: [
      { href: "/faith-formation", label: "Overview", icon: GraduationCap },
      { href: "/calendar?filter=ccd", label: "CCD Calendar", icon: Calendar },
      { href: "/ccd-registration", label: "CCD Registration", icon: FileText },
      { href: "/ccd-permissions", label: "CCD Permission Forms", icon: FileText },
    ],
  },
  {
    title: "Parish Life",
    items: [
      { href: "/news", label: "News", icon: Newspaper },
      { href: "/calendar", label: "Calendar", icon: Calendar },
      { href: "/gallery", label: "Photo Gallery", icon: Church },
      { href: "/bulletins", label: "Weekly Bulletins", icon: BookOpen },
      { href: "/calendar?filter=cyo", label: "CYO Schedule", icon: Calendar },
      { href: "/ministries", label: "Ministries & Devotions", icon: HandHeart },
      { href: "/volunteer", label: "Volunteer", icon: Users },
      { href: "/forms", label: "Forms & Documents", icon: FileText },
    ],
  },
  {
    title: "Give & Connect",
    items: [
      { href: "/giving", label: "Give Online", icon: Heart },
      { href: "/contact", label: "Contact Us", icon: Phone },
    ],
  },
  {
    title: "About",
    items: [
      { href: "/about", label: "Our Parish", icon: Church },
      { href: "/new-here", label: "New Here? Plan Your Visit", icon: UserPlus },
      { href: "/staff", label: "Staff & Leadership", icon: Users },
      { href: "/parish-registration", label: "Register as a Parishioner", icon: UserPlus },
    ],
  },
];

// Re-export Search icon for use in MobileMenu
export { Search };
