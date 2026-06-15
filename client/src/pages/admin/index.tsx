/**
 * Admin page index - re-exports the individual manager components
 * from the legacy Admin.tsx file for use in the new sidebar layout.
 */
export { default as DashboardHome } from "./DashboardHome";
export { default as GalleryManager } from "./GalleryManager";
export { default as UserManager } from "./UserManager";

// The remaining managers are still in the legacy Admin.tsx
// They are imported directly from there via named exports
