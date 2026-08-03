export function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

export function isWithinWindow(dateValue: string, since: Date): boolean {
  const date = new Date(dateValue);
  return Number.isFinite(date.getTime()) && date >= since;
}

export function bangkokIsoNow(): string {
  const now = new Date();
  const bangkokOffsetMs = 7 * 60 * 60 * 1000;
  return new Date(now.getTime() + bangkokOffsetMs).toISOString().replace("Z", "+07:00");
}

export function getBangkokDateParts(date = new Date()): { year: string; month: string; isoDate: string } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Bangkok"
  });
  const isoDate = formatter.format(date);
  const [year, month] = isoDate.split("-");

  return {
    year: year ?? date.getUTCFullYear().toString(),
    month: month ?? String(date.getUTCMonth() + 1).padStart(2, "0"),
    isoDate
  };
}
