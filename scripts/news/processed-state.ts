import { readFile, writeFile } from "node:fs/promises";

export interface ProcessedArticleRecord {
  id: string;
  url: string;
  slug: string;
  sourceName: string;
  processedAt: string;
}

interface ProcessedState {
  articles: ProcessedArticleRecord[];
}

const DEFAULT_STATE: ProcessedState = {
  articles: []
};

export async function loadProcessedState(path = "data/processed-articles.json"): Promise<ProcessedState> {
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw) as Partial<ProcessedState>;
    return {
      articles: Array.isArray(parsed.articles) ? parsed.articles : []
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return DEFAULT_STATE;
    }

    throw error;
  }
}

export function hasProcessedArticle(state: ProcessedState, id: string): boolean {
  return state.articles.some((article) => article.id === id);
}

export async function saveProcessedState(
  records: ProcessedArticleRecord[],
  path = "data/processed-articles.json"
): Promise<void> {
  const state = await loadProcessedState(path);
  const byId = new Map(state.articles.map((article) => [article.id, article]));

  for (const record of records) {
    byId.set(record.id, record);
  }

  await writeFile(
    path,
    `${JSON.stringify({ articles: [...byId.values()] }, null, 2)}\n`,
    "utf8"
  );
}
