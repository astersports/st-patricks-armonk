/**
 * PushNotificationBanner — opt-in banner for browser push notifications.
 * Shows on the Bulletins page when the user hasn't subscribed yet.
 * ~65 lines
 */
import { Bell, BellOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useState } from "react";
import { toast } from "sonner";

export function PushNotificationBanner() {
  const { state, isSubscribed, subscribe, unsubscribe, isSupported } = usePushNotifications();
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("push-banner-dismissed") === "1"; } catch { return false; }
  });

  // Don't show if unsupported, denied, or user dismissed this session
  if (!isSupported || state === "denied" || dismissed) return null;

  // Already subscribed — show a subtle confirmation
  if (isSubscribed) {
    return (
      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-2 flex items-center gap-2 text-xs">
        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="text-emerald-800 dark:text-emerald-200 font-medium">
          Push notifications enabled
        </span>
        <button
          onClick={async () => { await unsubscribe(); toast.success("Notifications disabled"); }}
          className="ml-auto text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 text-[10px] underline"
        >
          Turn off
        </button>
      </div>
    );
  }

  // Show opt-in banner
  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      toast.success("You'll be notified when new bulletins are published!");
    } else if (Notification.permission === "denied") {
      toast.error("Notifications blocked. Please enable in browser settings.");
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem("push-banner-dismissed", "1"); } catch {}
  };

  return (
    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2.5 flex items-center gap-2.5">
      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
          Get notified instantly when a new bulletin is published
        </p>
      </div>
      <Button
        size="sm"
        variant="default"
        className="h-7 text-xs px-3 shrink-0"
        onClick={handleEnable}
        disabled={state === "loading"}
      >
        {state === "loading" ? "..." : "Enable"}
      </Button>
      <button onClick={handleDismiss} className="text-blue-400 hover:text-blue-600 shrink-0" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
