const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeZone: "Asia/Bangkok"
});

const dateTimeFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok"
});

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return dateTimeFormatter.format(new Date(date));
}

export function toIsoDate(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}
