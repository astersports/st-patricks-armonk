/**
 * At a Glance — Quick reference table for Mass times, confession, and lauds.
 */

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AtAGlance() {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="font-serif text-xl font-bold">At a Glance</h2>
      </div>
      <Card className="border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/40">
                <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider w-28">Weekend</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">Sat 5:30 PM</span>
                  <span className="text-muted-foreground/50 mx-2">·</span>
                  <span className="font-semibold">Sun 8:30, 10:30, 12:30*</span>
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Weekday</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">Tue–Fri 8:30 AM</span>
                  <span className="text-muted-foreground ml-2 text-xs">(No Monday Mass)</span>
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Confession</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">Sat 4:30–5:15 PM</span>
                  <span className="text-muted-foreground ml-2 text-xs">or by appt.</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Lauds</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">Tue–Fri 8:00 AM</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="px-4 py-2.5 bg-muted/20 border-t border-border/40">
            <p className="text-xs text-muted-foreground">*12:30 PM Mass: October – June only. Holy Days announced in bulletin.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
