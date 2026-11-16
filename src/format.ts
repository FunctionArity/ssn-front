import type { Role } from "./api/types";

// "2026-03-01" → "domingo, 1 de marzo de 2026". Dates come without a time, so they're read as local days.
export function formatDate(isoDate: string, style: "long" | "short" = "long") {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return style === "long"
    ? date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Notes come from the rich text editor as HTML; they're shown as plain text.
export function plainText(html: string | null | undefined) {
  if (!html) return "";
  return (new DOMParser().parseFromString(html, "text/html").body.textContent ?? "").trim();
}

export const roleLabels: Record<Role, string> = { guardian: "Guardián", vocal: "Vocal", priest: "Sacerdote" };
export const roleBadge: Record<Role, string> = { guardian: "badge_green", vocal: "badge_red", priest: "badge_purple" };
