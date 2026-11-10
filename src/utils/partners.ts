import sourcesConfig from "../../data/sources.json";
import type { NewsEntry } from "./content";

const partnerSourceNames = new Set(
  sourcesConfig.sources
    .filter((source) => typeof source.priorityBoost === "number" && source.priorityBoost > 0)
    .map((source) => source.name)
);

export function isPartnerArticle(article: NewsEntry): boolean {
  return partnerSourceNames.has(article.data.sourceName);
}

export function isPartnerSourceName(sourceName: string): boolean {
  return partnerSourceNames.has(sourceName);
}
