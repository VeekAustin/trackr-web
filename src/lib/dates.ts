/** Today's date in the user's own timezone, as YYYY-MM-DD (toISOString would give the UTC date). */
export function localDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Add (or subtract) whole days from a YYYY-MM-DD string. Uses UTC so DST never shifts the result. */
export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "2026-10" becomes "October 2026". */
export function formatMonth(key: string): string {
  return monthFormat.format(new Date(`${key}-01T00:00:00Z`));
}

/** A Monday as "Oct 19 – Oct 25". */
export function formatWeek(start: string): string {
  const from = dayFormat.format(new Date(`${start}T00:00:00Z`));
  const to = dayFormat.format(new Date(`${shiftDate(start, 6)}T00:00:00Z`));
  return `${from} – ${to}`;
}