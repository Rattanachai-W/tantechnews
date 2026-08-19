import type { ArticleCategory, ScoredArticle, RawArticle } from "../../src/types/article";
import { logger } from "../shared/logger";
import { loadAiScoringConfig } from "./ai-config";
import { requestAiScores } from "./ai-scoring-client";
import { buildScoringPrompt } from "./scoring-prompt";

const CATEGORY_PATTERNS: Array<{ category: ArticleCategory; pattern: RegExp }> = [
  { category: "AI", pattern: /\b(ai|artificial intelligence|model|llm|openai|anthropic|gemini)\b/i },
  { category: "Programming", pattern: /\b(developer|programming|javascript|typescript|python|api|sdk)\b/i },
  { category: "Cloud", pattern: /\b(cloud|serverless|aws|azure|google cloud|cloudflare|infrastructure)\b/i },
  { category: "Cybersecurity", pattern: /\b(security|vulnerability|breach|malware|ransomware|cve)\b/i },
  { category: "Startup", pattern: /\b(startup|funding|seed|series [abc]|venture)\b/i },
  { category: "Business", pattern: /\b(price|revenue|acquisition|merger|policy|business)\b/i },
  { category: "Open Source", pattern: /\b(open source|github|license|repository)\b/i },
  { category: "Data", pattern: /\b(data|database|analytics|warehouse|postgres|sql)\b/i },
  { category: "Hardware", pattern: /\b(chip|gpu|cpu|device|hardware|semiconductor)\b/i },
  { category: "Mobile", pattern: /\b(android|ios|iphone|mobile|app store)\b/i },
  { category: "Science", pattern: /\b(research|paper|science|study|experiment)\b/i }
];

function inferCategory(article: RawArticle): ArticleCategory {
  const haystack = `${article.title} ${article.description ?? ""}`;
  const matches = CATEGORY_PATTERNS.filter(({ pattern }) => pattern.test(haystack)).map(
    ({ category }) => category
  );

  if (matches.length === 0) return "Business";

  // Prefer more specific categories over generic ones.
  // If the article has both "AI" and "Business" signals, trust AI first
  // because AI is more specific and valuable to TanTech readers.
  // "Business" is used as a last-resort catch-all by the pattern above.
  const priority: ArticleCategory[] = [
    "Cybersecurity",
    "AI",
    "Programming",
    "Cloud",
    "Open Source",
    "Data",
    "Hardware",
    "Mobile",
    "Science",
    "Startup",
    "Business"
  ];

  return priority.find((cat) => matches.includes(cat)) ?? matches[0];
}

function credibilityFromTier(article: RawArticle): number {
  if (article.sourceTier === 1) return 9;
  if (article.sourceTier === 2) return 7;
  if (article.sourceTier === 3) return 4;
  return article.sourceType === "rss" ? 6 : 5;
}

export function scoreArticleWithRules(article: RawArticle): ScoredArticle {
  const importance = /launch|security|vulnerability|funding|price|policy|release/i.test(article.title) ? 8 : 5;
  const relevance = /ai|developer|cloud|security|startup|open source|data/i.test(
    `${article.title} ${article.description ?? ""}`
  )
    ? 8
    : 5;
  const novelty = 6;
  const credibility = credibilityFromTier(article);
  const totalScore = importance * 0.4 + relevance * 0.3 + novelty * 0.2 + credibility * 0.1;

  return {
    ...article,
    score: {
      importance,
      relevance,
      novelty,
      credibility,
      totalScore,
      category: inferCategory(article),
      reason: "Rule-based MVP score; replace with structured AI scoring after API setup."
    }
  };
}

export function scoreArticles(articles: RawArticle[]): ScoredArticle[] {
  return articles.map((article) => scoreArticleWithRules(article));
}

export async function scoreArticlesWithAi(articles: RawArticle[]): Promise<ScoredArticle[]> {
  const aiConfig = loadAiScoringConfig();
  const ruleBasedScores = scoreArticles(articles);

  if (!aiConfig || articles.length === 0) {
    return ruleBasedScores;
  }

  const aiScores = await requestAiScores(aiConfig, buildScoringPrompt(articles));
  if (!aiScores) {
    logger.warn("Falling back to rule-based scores after AI scoring failure");
    return ruleBasedScores;
  }

  return ruleBasedScores.map((article) => {
    const score = aiScores.get(article.id);
    return score ? { ...article, score } : article;
  });
}
