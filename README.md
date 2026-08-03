# ทันเทค | TanTech News

Static-first Thai technology news site for curated daily summaries.

## Development

```bash
pnpm install
pnpm dev
```

## Validation

```bash
pnpm validate:content
pnpm test
pnpm build
```

## Automation

Daily news generation is designed to create review pull requests, not push directly to `main`. After generating Markdown, the workflow runs content validation, unit tests, and the production build before it opens a draft PR.

Optional AI summarization is configured with environment variables:

```bash
AI_API_ENDPOINT=
AI_API_KEY=
AI_MODEL=
AI_SCORING_MODEL=
AI_SUMMARY_MODEL=
AI_TIMEOUT_MS=45000
AI_MAX_RETRIES=2
```

The scoring and summarization clients expect the API to return JSON objects that match their Zod schemas. If AI configuration is missing or validation fails, generation falls back to rule-based scoring or a conservative extractive draft and keeps the workflow moving for human review.

### News Sources

News sources are configured in `data/sources.json`. RSS sources need only their feed URL and metadata. API sources can map JSON fields into TanTech's raw article shape:

```json
{
  "id": "example-api",
  "name": "Example API",
  "url": "https://api.example.com/news",
  "type": "api",
  "enabled": true,
  "tier": 2,
  "categories": ["Business"],
  "language": "en",
  "mapping": {
    "itemsPath": "data.items",
    "title": "headline",
    "url": "links.canonical",
    "publishedAt": "published_at",
    "description": "summary",
    "author": "byline.name",
    "imageUrl": "image.url"
  }
}
```

The `itemsPath` field is optional when the API returns an array at the response root. Dot paths also support numeric array indexes such as `items.0.url`.

### Generate News Locally

```bash
pnpm news:generate
pnpm validate:content
pnpm test
pnpm build
```

Generated news drafts are written to `src/content/news/YYYY/MM/` and daily digests are written to `src/content/daily/`. The processed article state is saved in `data/processed-articles.json` so the same source URL is not drafted repeatedly.

### Editorial Review

Automated news PRs are opened as drafts. Before merging, review the PR checklist and confirm:

- Facts are supported by the linked original source.
- Analysis in `มุมมองของทันเทค` is clearly separate from reported facts.
- The Thai summary is concise, natural, and not clickbait.
- Source URLs do not contain tracking parameters.
- Categories and tags match the validated TanTech category list.
- No prompt text, JSON fragments, placeholders, or fake citations are present.

Keep the generated PR as draft until a human editor has reviewed the article content. Content should be merged only after validation and build checks pass.

To preview draft articles locally, enable the explicit review flag before running the dev server or build:

```bash
TANTECH_INCLUDE_DRAFTS=true pnpm dev
TANTECH_INCLUDE_DRAFTS=true pnpm build
```

On Windows PowerShell:

```powershell
$env:TANTECH_INCLUDE_DRAFTS="true"; pnpm dev
```

Preview mode renders draft content, adds visible draft labels, and marks pages as `noindex,nofollow`. Keep `TANTECH_INCLUDE_DRAFTS` unset or `false` for production builds.

## Search

The production build runs Pagefind after Astro builds the static HTML:

```bash
pnpm build
```

Search assets are generated into `dist/pagefind`.

## Deploy

The default target is Cloudflare Pages. Configure these repository secrets before enabling the deploy workflow:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Cloudflare Pages uses `dist` as the build output directory.
