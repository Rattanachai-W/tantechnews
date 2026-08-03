export interface GenerationOptions {
    date: Date;
    maxArticles: number;
    dryRun: boolean;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseDate(value: string | undefined): Date {
    if (!value) {
        return new Date();
    }

    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function resolveGenerationOptions(env = process.env): GenerationOptions {
    return {
        date: parseDate(env.NEWS_DATE),
        maxArticles: parsePositiveInteger(env.MAX_ARTICLES, 10),
        dryRun: env.DRY_RUN === "true"
    };
}
