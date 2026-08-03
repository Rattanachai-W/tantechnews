export interface ArchiveEntryLike {
  data: {
    publishedAt: Date;
  };
}

export interface ArchiveMonthGroup<TEntry extends ArchiveEntryLike> {
  key: string;
  label: string;
  articles: TEntry[];
}

const monthFormatter = new Intl.DateTimeFormat("th-TH", {
  month: "long",
  year: "numeric",
  timeZone: "Asia/Bangkok"
});

function monthKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    timeZone: "Asia/Bangkok"
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? date.getUTCFullYear().toString();
  const month = parts.find((part) => part.type === "month")?.value ?? "01";

  return `${year}-${month}`;
}

export function groupArticlesByPublishedMonth<TEntry extends ArchiveEntryLike>(
  articles: TEntry[]
): Array<ArchiveMonthGroup<TEntry>> {
  const groups = new Map<string, ArchiveMonthGroup<TEntry>>();

  for (const article of articles) {
    const key = monthKey(article.data.publishedAt);
    const group =
      groups.get(key) ??
      ({
        key,
        label: monthFormatter.format(article.data.publishedAt),
        articles: []
      } satisfies ArchiveMonthGroup<TEntry>);

    group.articles.push(article);
    groups.set(key, group);
  }

  return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key));
}
