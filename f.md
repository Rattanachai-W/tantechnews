## 1. Project Overview

**Project Name:** ทันเทค  
**English Name:** TanTech News  
**Domain:** `tantechnews.com`

ทันเทคเป็นเว็บไซต์ Static Site สำหรับสรุปข่าวด้านเทคโนโลยีประจำวัน โดยระบบจะดึงข่าวจาก RSS, API และเว็บไซต์ทางการ จากนั้นใช้ AI ช่วยคัดเลือก จัดอันดับ สรุป และสร้างบทความในรูปแบบ Markdown ลงในโปรเจกต์

เว็บไซต์ต้องเน้น:

- โหลดเร็ว
- ต้นทุนต่ำ
- ดูแลรักษาง่าย
- ไม่มีฐานข้อมูลในช่วง MVP
- เนื้อหาอ่านง่ายและอ้างอิงต้นฉบับได้
- แยกข้อเท็จจริงออกจากบทวิเคราะห์
- รองรับการสร้างข่าวผ่านระบบอัตโนมัติ
- ผู้ดูแลตรวจสอบข่าวผ่าน Pull Request ก่อนเผยแพร่

---

## 2. Product Goal

เป้าหมายของทันเทคไม่ใช่การรวบรวมข่าวทุกข่าว แต่เป็นการคัดเลือกข่าวเทคโนโลยีที่สำคัญที่สุดในแต่ละวัน แล้วสรุปให้ผู้อ่านเข้าใจได้ภายในไม่กี่นาที

คุณค่าหลักของเว็บไซต์คือ:

1. คัดเฉพาะข่าวที่สำคัญ
2. สรุปเป็นภาษาไทยที่อ่านง่าย
3. อธิบายว่าทำไมข่าวนั้นจึงสำคัญ
4. วิเคราะห์ผลกระทบต่อนักพัฒนา ธุรกิจ และผู้ใช้งาน
5. อ้างอิงแหล่งข่าวต้นฉบับทุกครั้ง
6. ลดข้อมูลซ้ำและข่าวประชาสัมพันธ์ที่ไม่มีสาระสำคัญ

คำโปรยของเว็บไซต์:

> สรุปข่าวเทคสำคัญ ให้คุณทันทุกวัน

---

## 3. Target Audience

กลุ่มผู้ใช้งานหลัก:

- Software Developer
- IT Professional
- Startup Founder
- Product Manager
- เจ้าของธุรกิจ
- นักลงทุนที่สนใจเทคโนโลยี
- นักศึกษาและบุคคลทั่วไปที่ติดตาม AI และเทคโนโลยี

เนื้อหาต้องใช้ภาษาที่คนทั่วไปอ่านเข้าใจได้ แต่ยังคงความถูกต้องเพียงพอสำหรับคนทำงานด้านเทคโนโลยี

---

## 4. MVP Scope

ฟีเจอร์ที่ต้องมีใน MVP:

- หน้าแรกแสดงข่าวล่าสุด
- หน้ารวมข่าวประจำวัน
- หน้ารายละเอียดข่าว
- หน้าหมวดหมู่
- หน้าคลังข่าวย้อนหลัง
- RSS Feed ของเว็บไซต์
- Sitemap
- SEO Metadata
- รองรับ Open Graph
- รองรับ Mobile และ Desktop
- ระบบค้นหาภายในเว็บไซต์
- ระบบสร้างบทความจาก Markdown
- GitHub Actions สำหรับสร้างข่าวประจำวัน
- ระบบเปิด Pull Request สำหรับตรวจข่าวก่อนเผยแพร่
- Deploy ผ่าน Cloudflare Pages หรือแพลตฟอร์ม Static Hosting

สิ่งที่ยังไม่ต้องทำใน MVP:

- ระบบสมาชิก
- ฐานข้อมูล
- Admin Dashboard
- ระบบ Comment
- ระบบ Subscription แบบเสียเงิน
- ระบบ Personalization
- Mobile Application
- ระบบแจ้งเตือน Push Notification
- ระบบเขียนข่าวผ่านหน้าเว็บไซต์

---

## 5. Recommended Technology Stack

### Frontend

- Astro
- TypeScript
- Tailwind CSS
- Astro Content Collections
- Markdown หรือ MDX
- Pagefind สำหรับค้นหาบทความ

### Automation

- Node.js
- TypeScript
- GitHub Actions
- RSS Parser
- Mozilla Readability
- JSDOM
- Zod
- AI API ที่รองรับ Structured Output

### Hosting

ตัวเลือกหลัก:

- Cloudflare Pages

ตัวเลือกสำรอง:

- Vercel
- Netlify
- GitHub Pages

### Package Manager

ใช้ `pnpm` เป็นค่าเริ่มต้น

ห้ามเปลี่ยน Package Manager โดยไม่มีเหตุผลที่ชัดเจน

---

## 6. High-Level Architecture

```text
RSS / News API / Official Blog
              │
              ▼
      Scheduled GitHub Action
              │
              ▼
        Fetch Raw Articles
              │
              ▼
 Normalize and Remove Duplicates
              │
              ▼
      Rule-Based Pre-Filtering
              │
              ▼
        AI Article Scoring
              │
              ▼
      Select Top Articles
              │
              ▼
       Extract Full Content
              │
              ▼
        AI Summarization
              │
              ▼
      Validate Structured Output
              │
              ▼
       Generate Markdown Files
              │
              ▼
   Create Branch and Pull Request
              │
              ▼
          Human Review
              │
              ▼
             Merge
              │
              ▼
      Static Build and Deploy
```

---

## 7. Repository Structure

ใช้โครงสร้างประมาณนี้:

```text
tantechnews/
├── .github/
│   └── workflows/
│       ├── generate-daily-news.yml
│       ├── validate-content.yml
│       └── deploy.yml
├── data/
│   ├── sources.json
│   ├── processed-articles.json
│   └── blocked-domains.json
├── public/
│   ├── favicon.svg
│   ├── logo.svg
│   ├── robots.txt
│   └── images/
├── scripts/
│   ├── news/
│   │   ├── fetch-articles.ts
│   │   ├── normalize-articles.ts
│   │   ├── deduplicate-articles.ts
│   │   ├── filter-articles.ts
│   │   ├── score-articles.ts
│   │   ├── extract-article.ts
│   │   ├── summarize-article.ts
│   │   ├── validate-summary.ts
│   │   ├── generate-markdown.ts
│   │   └── generate-daily-news.ts
│   ├── content/
│   │   ├── validate-content.ts
│   │   └── calculate-reading-time.ts
│   └── shared/
│       ├── logger.ts
│       ├── retry.ts
│       ├── hash.ts
│       └── date.ts
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── news/
│   │   └── seo/
│   ├── content/
│   │   ├── config.ts
│   │   ├── news/
│   │   └── daily/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── archive/
│   │   ├── category/
│   │   ├── news/
│   │   ├── rss.xml.ts
│   │   └── sitemap.xml.ts
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   ├── article.ts
│   │   └── source.ts
│   └── utils/
│       ├── content.ts
│       ├── format-date.ts
│       └── slug.ts
├── AGENTS.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.mjs
├── tsconfig.json
└── README.md
```

Agent สามารถปรับโครงสร้างได้เมื่อมีเหตุผล แต่ต้องรักษาหลัก Separation of Concerns และไม่รวม Logic ทั้งหมดไว้ในไฟล์เดียว

---

## 8. Development Principles

Agent ต้องปฏิบัติตามหลักต่อไปนี้:

### 8.1 Keep It Simple

เลือกวิธีที่ง่ายที่สุดที่ตอบโจทย์ MVP

อย่าเพิ่ม:

- Database
- Queue
- Microservices
- Authentication
- CMS
- External State Management

เว้นแต่มี Requirement ชัดเจน

### 8.2 Static First

ทุกหน้าควรถูกสร้างเป็น Static HTML เท่าที่ทำได้

หลีกเลี่ยง Client-Side JavaScript ที่ไม่จำเป็น

ใช้ JavaScript ฝั่ง Browser เฉพาะกรณีที่ต้องมี Interaction จริง ๆ เช่น:

- Search
- Menu บน Mobile
- Theme Toggle
- Filter บทความ

### 8.3 Type Safety

ใช้ TypeScript แบบ Strict

ห้ามใช้ `any` เว้นแต่:

- จำเป็นจริง
- มี Comment อธิบาย
- ไม่มี Type ที่เหมาะสม
- มีแผนแก้ในภายหลัง

ควรใช้:

- `unknown`
- Type Guard
- Zod Schema
- Explicit Interface

### 8.4 Fail Safely

ความผิดพลาดของข่าวหนึ่งเรื่องต้องไม่ทำให้ Workflow ทั้งหมดล้มเหลวโดยไม่จำเป็น

ตัวอย่าง:

- RSS แหล่งหนึ่งล่ม ให้ข้ามและบันทึก Log
- ดึงบทความหนึ่งไม่ได้ ให้ข้ามบทความนั้น
- AI ส่ง JSON ผิด ให้ Retry
- Validation ไม่ผ่าน ให้ไม่สร้างบทความ
- ข่าวไม่เพียงพอ ให้สร้างเฉพาะข่าวที่ผ่านเกณฑ์

### 8.5 Human Review First

ใน MVP ห้าม Bot Push เนื้อหาขึ้น `main` โดยตรง

ระบบต้อง:

1. สร้าง Branch
2. สร้าง Markdown
3. Commit
4. Push
5. เปิด Pull Request
6. รอ Human Review
7. Merge
8. Deploy

---

## 9. Coding Standards

### 9.1 Naming

ใช้ชื่อไฟล์แบบ `kebab-case`

```text
generate-daily-news.ts
processed-articles.json
article-card.astro
```

ใช้ชื่อตัวแปรและฟังก์ชันแบบ `camelCase`

```ts
const publishedArticles = [];
function generateArticleSlug() {}
```

ใช้ชื่อ Type, Interface และ Class แบบ `PascalCase`

```ts
interface RawArticle {}
type ArticleCategory = string;
class ArticleExtractor {}
```

ใช้ Constant แบบ `UPPER_SNAKE_CASE` เฉพาะค่าคงที่ระดับ Global

```ts
const MAX_ARTICLES_PER_DAY = 10;
```

### 9.2 Functions

ฟังก์ชันหนึ่งควรทำหน้าที่เดียว

หลีกเลี่ยงฟังก์ชันที่ยาวเกินไป

ตัวอย่างที่ดี:

```ts
async function processArticle(article: RawArticle): Promise<ProcessedArticle | null> {
  const content = await extractArticleContent(article.url);

  if (!content) {
    return null;
  }

  const summary = await summarizeArticle(article, content);
  const validation = articleSummarySchema.safeParse(summary);

  if (!validation.success) {
    return null;
  }

  return mapSummaryToProcessedArticle(article, validation.data);
}
```

### 9.3 Error Handling

ห้ามกลืน Error โดยไม่มี Log

ไม่ควรเขียน:

```ts
try {
  await fetchArticle();
} catch {}
```

ควรเขียน:

```ts
try {
  await fetchArticle();
} catch (error) {
  logger.error("Failed to fetch article", {
    error,
    articleUrl,
  });
}
```

Error Message ต้องมี Context เพียงพอ แต่ห้าม Log:

- API Key
- Token
- Secret
- Credential
- เนื้อหาส่วนตัว
- Environment Variable ที่เป็นความลับ

### 9.4 Async Code

ใช้ `async/await`

หลีกเลี่ยง Promise Chain ที่ซ้อนกันหลายชั้น

จำกัดจำนวน Request พร้อมกันเพื่อไม่สร้างภาระต่อเว็บไซต์ต้นทาง

ตัวอย่าง:

```ts
const MAX_CONCURRENT_REQUESTS = 5;
```

### 9.5 Comments

Comment ควรอธิบาย “เหตุผล” ไม่ใช่อธิบายสิ่งที่ Code ทำอยู่แล้ว

ไม่ควรเขียน:

```ts
// เพิ่มคะแนนหนึ่ง
score += 1;
```

ควรเขียน:

```ts
// Give official sources a small credibility boost.
score += 1;
```

---

## 10. Domain Models

### 10.1 Raw Article

```ts
export interface RawArticle {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  sourceType: "rss" | "api" | "manual";
  publishedAt: string;
  description?: string;
  author?: string;
  imageUrl?: string;
}
```

### 10.2 Scored Article

```ts
export interface ArticleScore {
  importance: number;
  relevance: number;
  novelty: number;
  credibility: number;
  totalScore: number;
  category: ArticleCategory;
  reason: string;
}

export interface ScoredArticle extends RawArticle {
  score: ArticleScore;
}
```

คะแนนแต่ละด้านอยู่ระหว่าง `1-10`

### 10.3 Article Summary

```ts
export interface ArticleSummary {
  titleTh: string;
  excerpt: string;
  whatHappened: string;
  whyItMatters: string;
  impacts: ArticleImpact[];
  tantechView: string;
  oneSentenceSummary: string;
  categories: ArticleCategory[];
  tags: string[];
}
```

### 10.4 Article Impact

```ts
export interface ArticleImpact {
  group:
    | "developers"
    | "businesses"
    | "startups"
    | "investors"
    | "consumers"
    | "society"
    | "other";
  title: string;
  description: string;
}
```

### 10.5 Processed Article

```ts
export interface ProcessedArticle extends RawArticle {
  slug: string;
  summary: ArticleSummary;
  score: ArticleScore;
  readingTimeMinutes: number;
  generatedAt: string;
  status: "draft" | "review" | "published" | "rejected";
}
```

---

## 11. Article Categories

ใช้หมวดหมู่หลักดังนี้:

```ts
export const ARTICLE_CATEGORIES = [
  "AI",
  "Programming",
  "Cloud",
  "Cybersecurity",
  "Startup",
  "Business",
  "Open Source",
  "Data",
  "Hardware",
  "Mobile",
  "Science",
] as const;
```

หนึ่งบทความควรมีหมวดหมู่หลักไม่เกิน 3 หมวด

ห้ามสร้างหมวดใหม่จาก AI โดยอัตโนมัติโดยไม่ผ่าน Validation

---

## 12. News Source Rules

แหล่งข่าวแบ่งเป็นสามระดับ

### Tier 1: Primary Source

ให้ความสำคัญสูงสุด:

- Official Company Blog
- Official Product Announcement
- GitHub Repository
- Official Documentation
- Government Website
- Regulatory Filing
- Research Paper
- Conference Announcement

### Tier 2: Trusted Technology Publication

ตัวอย่าง:

- TechCrunch
- Ars Technica
- The Verge
- Wired
- MIT Technology Review
- IEEE Spectrum

### Tier 3: Discovery Source

ใช้ค้นหาเรื่องที่กำลังได้รับความสนใจ แต่ไม่ควรใช้เป็นแหล่งอ้างอิงเดียว:

- Hacker News
- Reddit
- Social Media
- Community Forum
- Aggregator Website

เมื่อพบข่าวจาก Tier 3 ให้พยายามค้นหา Primary Source ก่อนสรุป

---

## 13. RSS Source Configuration

แหล่งข่าวต้องถูกเก็บในไฟล์ Configuration ไม่ควร Hardcode กระจายหลายไฟล์

ตัวอย่าง `data/sources.json`:

```json
{
  "sources": [
    {
      "id": "openai-blog",
      "name": "OpenAI Blog",
      "url": "https://example.com/rss.xml",
      "type": "rss",
      "enabled": true,
      "tier": 1,
      "categories": ["AI"],
      "language": "en"
    }
  ]
}
```

Schema:

```ts
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: "rss" | "api";
  enabled: boolean;
  tier: 1 | 2 | 3;
  categories: ArticleCategory[];
  language: string;
}
```

ห้ามเพิ่ม URL ของแหล่งข่าวโดยไม่มีชื่อ Source และ Tier

---

## 14. News Collection Flow

ระบบสร้างข่าวประจำวันต้องทำตามลำดับดังนี้:

### Step 1: Load Sources

อ่านแหล่งข่าวจาก `data/sources.json`

ใช้เฉพาะ Source ที่มี `enabled: true`

### Step 2: Fetch Articles

ดึงข่าวย้อนหลังตามช่วงเวลาที่กำหนด เช่น 24–48 ชั่วโมง

ทุก Request ต้องมี:

- Timeout
- Retry แบบจำกัด
- User-Agent
- Error Logging

### Step 3: Normalize Data

แปลงข้อมูลจากทุก Source ให้อยู่ในรูป `RawArticle`

ต้อง Normalize:

- URL
- Date
- Whitespace
- HTML Entity
- Source Name
- Title

### Step 4: Remove Duplicates

ตรวจสอบข่าวซ้ำด้วยหลายเงื่อนไข:

1. Canonical URL
2. URL Hash
3. Normalized Title
4. Title Similarity
5. ข่าวเหตุการณ์เดียวกันจากหลาย Source

เมื่อหลาย Source รายงานเรื่องเดียวกัน ให้เลือก:

1. Primary Source
2. Source ที่น่าเชื่อถือกว่า
3. Source ที่มีรายละเอียดมากกว่า
4. Source ที่เผยแพร่ก่อน

### Step 5: Rule-Based Filter

ตัดข่าวที่:

- เก่าเกินช่วงเวลา
- ไม่มี URL
- ไม่มีชื่อเรื่อง
- เป็น Sponsored Content
- เป็นข่าวประชาสัมพันธ์ที่ไม่มีสาระสำคัญ
- เป็นบทความ Listicle คุณภาพต่ำ
- เป็นข่าวซ้ำ
- ไม่เกี่ยวข้องกับหมวดของทันเทค
- มีแหล่งที่มาไม่น่าเชื่อถือ

### Step 6: AI Scoring

ส่งเฉพาะ Metadata ที่จำเป็นให้ AI ก่อน

ห้ามส่งเนื้อหาบทความเต็มเพื่อทำ Scoring หากยังไม่จำเป็น

### Step 7: Select Top Articles

เลือกข่าวตามคะแนนรวม แต่ต้องรักษาความหลากหลายของหมวดหมู่

ไม่ควรให้ข่าวทั้งหมดในวันเดียวอยู่ในหมวด AI หากยังมีข่าวสำคัญในหมวดอื่น

ค่าตั้งต้น:

```ts
const MIN_ARTICLES_PER_DAY = 3;
const MAX_ARTICLES_PER_DAY = 10;
```

### Step 8: Extract Full Article

ดึงเนื้อหาเต็มเฉพาะข่าวที่ผ่านการคัดเลือก

### Step 9: Generate Summary

ส่งเนื้อหาให้ AI สรุปตาม Structured Output

### Step 10: Validate

ตรวจสอบ Output ด้วย Zod

### Step 11: Generate Markdown

สร้างไฟล์บทความใน `src/content/news`

### Step 12: Create Daily Digest

สร้างหน้าสรุปรวมประจำวันใน `src/content/daily`

### Step 13: Save Processed State

เพิ่ม Article ID ลงใน `data/processed-articles.json`

### Step 14: Open Pull Request

สร้าง Branch และ Pull Request สำหรับ Human Review

---

## 15. Article Scoring Rules

คะแนนรวมคำนวณจาก:

```text
Total Score =
Importance × 0.40
+ Relevance × 0.30
+ Novelty × 0.20
+ Credibility × 0.10
```

### Importance

พิจารณาว่าข่าวส่งผลกระทบมากเพียงใด เช่น:

- เปิดตัวผลิตภัณฑ์สำคัญ
- เปลี่ยนนโยบาย
- เปลี่ยนราคา
- เปลี่ยน License
- การควบรวมกิจการ
- การระดมทุนขนาดใหญ่
- ช่องโหว่ด้านความปลอดภัย
- การเปลี่ยนแปลงที่กระทบนักพัฒนา

### Relevance

พิจารณาความเกี่ยวข้องกับกลุ่มผู้อ่านของทันเทค

### Novelty

พิจารณาว่าข่าวมีข้อมูลใหม่จริงหรือเป็นเพียงการนำข่าวเก่ามาเล่าใหม่

### Credibility

พิจารณาจาก:

- Source Tier
- มี Primary Source หรือไม่
- มีการยืนยันจากหลายแหล่งหรือไม่
- เป็นข่าวลือหรือไม่

---

## 16. AI Prompt Rules

ทุก Prompt ต้องกำหนดบทบาท งาน Input Output และข้อห้ามอย่างชัดเจน

AI ต้อง:

- ใช้เฉพาะข้อมูลจากเนื้อหาต้นฉบับ
- ไม่แต่งตัวเลข
- ไม่แต่งคำพูด
- ไม่แต่งชื่อบุคคล
- ไม่เพิ่มข้อเท็จจริงที่ไม่มีแหล่งอ้างอิง
- ไม่แปลชื่อผลิตภัณฑ์หรือชื่อบริษัทผิด
- แยกข้อเท็จจริงออกจากบทวิเคราะห์
- เขียนภาษาไทยที่เป็นธรรมชาติ
- หลีกเลี่ยงภาษาการตลาด
- หลีกเลี่ยงข้อความเกินจริง
- ไม่คัดลอกต้นฉบับเป็นช่วงยาว
- ระบุเมื่อข้อมูลไม่เพียงพอ
- คืนค่าเป็น JSON ตาม Schema เท่านั้น

ตัวอย่าง System Prompt:

```text
คุณเป็นบรรณาธิการข่าวเทคโนโลยีของเว็บไซต์ทันเทค

หน้าที่ของคุณคือสรุปบทความต้นฉบับเป็นภาษาไทยที่ถูกต้อง กระชับ และเข้าใจง่าย

กฎสำคัญ:
1. ใช้เฉพาะข้อมูลที่อยู่ในต้นฉบับ
2. ห้ามสร้างตัวเลข ชื่อบุคคล วันที่ หรือคำกล่าวอ้างเพิ่มเติม
3. แยกข้อเท็จจริงออกจากบทวิเคราะห์
4. ห้ามเขียนภาษาประชาสัมพันธ์หรือกล่าวเกินจริง
5. หากข้อมูลไม่เพียงพอ ให้ระบุอย่างตรงไปตรงมา
6. ห้ามคัดลอกข้อความจากต้นฉบับเป็นประโยคยาว
7. ต้องรักษาชื่อบริษัท ชื่อผลิตภัณฑ์ และศัพท์เทคนิคให้ถูกต้อง
8. ส่งผลลัพธ์เป็น JSON ตาม Schema ที่กำหนดเท่านั้น
```

---

## 17. Article Writing Style

บทความของทันเทคต้องมีลักษณะดังนี้:

- ภาษาไทยอ่านง่าย
- กระชับ
- ไม่เป็นทางการเกินไป
- ไม่ใช้คำฟุ่มเฟือย
- ไม่เขียน Clickbait
- ไม่ใช้ Emoji ในเนื้อหาหลัก
- ไม่สร้างความตื่นตระหนก
- ไม่ออกความเห็นทางการเมืองโดยไม่มีหลักฐาน
- ไม่สรุปเกินข้อมูลต้นฉบับ
- อธิบายศัพท์เทคนิคเมื่อจำเป็น
- ใช้ชื่อภาษาอังกฤษในวงเล็บเมื่อช่วยให้เข้าใจ

โครงสร้างบทความมาตรฐาน:

```text
ชื่อข่าว
Metadata
เกริ่นนำ
เกิดอะไรขึ้น
ทำไมเรื่องนี้สำคัญ
ผลกระทบที่น่าจับตา
มุมมองของทันเทค
สรุปในประโยคเดียว
แหล่งข่าว
```

---

## 18. Content Schema

ตัวอย่าง Frontmatter:

```yaml
---
title: "ชื่อข่าวภาษาไทย"
slug: "article-slug"
excerpt: "คำอธิบายสั้นสำหรับหน้าแรก"
publishedAt: "2026-08-01T07:00:00+07:00"
sourcePublishedAt: "2026-07-31T22:00:00Z"
sourceName: "Source Name"
sourceUrl: "https://example.com/article"
author: "TanTech AI Desk"
categories:
  - AI
  - Business
tags:
  - Voice AI
  - Startup
readingTimeMinutes: 2
featured: false
draft: true
aiGenerated: true
reviewedBy: null
---
```

Field ที่จำเป็น:

- `title`
- `slug`
- `excerpt`
- `publishedAt`
- `sourcePublishedAt`
- `sourceName`
- `sourceUrl`
- `categories`
- `readingTimeMinutes`
- `draft`
- `aiGenerated`

Slug ต้อง:

- เป็นภาษาอังกฤษ
- เป็นตัวพิมพ์เล็ก
- ใช้เครื่องหมาย `-`
- ไม่มีวันที่หากไม่จำเป็น
- ไม่ยาวเกินไป
- ไม่ซ้ำ

---

## 19. Markdown File Structure

ข่าวแต่ละเรื่องเก็บเป็นไฟล์แยก:

```text
src/content/news/2026/08/article-slug.md
```

ตัวอย่างเนื้อหา:

```markdown
---
title: "ชื่อข่าว"
slug: "article-slug"
excerpt: "คำอธิบายสั้น"
publishedAt: "2026-08-01T07:00:00+07:00"
sourcePublishedAt: "2026-07-31T22:00:00Z"
sourceName: "Example"
sourceUrl: "https://example.com/article"
categories:
  - AI
readingTimeMinutes: 2
draft: true
aiGenerated: true
---

## เกิดอะไรขึ้น

เนื้อหาสรุปข่าว

## ทำไมเรื่องนี้สำคัญ

อธิบายความสำคัญ

## ผลกระทบที่น่าจับตา

### สำหรับนักพัฒนา

อธิบายผลกระทบ

### สำหรับธุรกิจ

อธิบายผลกระทบ

## มุมมองของทันเทค

บทวิเคราะห์ที่แยกออกจากข้อเท็จจริงอย่างชัดเจน

## สรุปในประโยคเดียว

> ข้อความสรุป

## แหล่งข่าว

[อ่านต้นฉบับ](https://example.com/article)
```

---

## 20. Daily Digest Structure

ไฟล์สรุปประจำวัน:

```text
src/content/daily/2026-08-01.md
```

ตัวอย่าง:

```yaml
---
title: "สรุปข่าวเทคประจำวันที่ 1 สิงหาคม 2026"
date: "2026-08-01"
articleSlugs:
  - first-article
  - second-article
  - third-article
draft: true
---
```

Daily Digest ไม่ควรทำสำเนาเนื้อหาข่าวทั้งหมด แต่ควรอ้างอิงบทความแต่ละเรื่องผ่าน Slug

---

## 21. Content Validation

ก่อน Commit ต้องตรวจสอบ:

- Frontmatter ครบ
- URL ถูกต้อง
- วันที่ถูกต้อง
- Slug ไม่ซ้ำ
- Source ไม่ว่าง
- Category ถูกต้อง
- ไม่มีหัวข้อว่าง
- ไม่มี Placeholder
- ไม่มีข้อความจาก Prompt หลุดมา
- ไม่มี JSON หลุดมาใน Markdown
- ไม่มีบทความซ้ำ
- ไม่มี URL ที่ใช้ `utm_source=chatgpt.com`
- ไม่มี Citation ปลอม
- ไม่มีตัวเลขที่ไม่พบในต้นฉบับ
- ไม่มีข้อความยาวผิดปกติ
- Markdown Build ผ่าน

ห้ามสร้างบทความเมื่อ Validation ไม่ผ่าน

---

## 22. Deduplication Rules

ใช้ URL Normalization ก่อน Hash

ต้องลบ Query Parameter ที่ไม่เกี่ยวข้อง เช่น:

```text
utm_source
utm_medium
utm_campaign
utm_term
utm_content
fbclid
gclid
ref
source
```

ห้ามลบ Parameter ที่เป็นส่วนหนึ่งของตัวตนบทความโดยไม่ตรวจสอบ

ใช้ SHA-256 สร้าง Article ID:

```ts
function createArticleId(normalizedUrl: string): string {
  return createHash("sha256")
    .update(normalizedUrl)
    .digest("hex");
}
```

`processed-articles.json` ไม่ควรเก็บเนื้อหาบทความเต็ม

ให้เก็บเฉพาะ:

```json
{
  "id": "sha256",
  "url": "https://example.com/article",
  "slug": "article-slug",
  "processedAt": "2026-08-01T06:00:00+07:00",
  "status": "published"
}
```

---

## 23. HTTP Client Rules

ทุก HTTP Request ต้องกำหนด Timeout

ตัวอย่าง:

```ts
const response = await fetch(url, {
  signal: AbortSignal.timeout(15_000),
  headers: {
    "User-Agent": "TanTechNewsBot/1.0",
  },
});
```

Retry เฉพาะ Error ที่มีโอกาสสำเร็จในครั้งถัดไป เช่น:

- Timeout
- HTTP 429
- HTTP 500
- HTTP 502
- HTTP 503
- HTTP 504

ห้าม Retry HTTP 400, 401, 403 หรือ 404 แบบไม่จำกัด

ใช้ Exponential Backoff และจำกัดจำนวนครั้ง

---

## 24. Rate Limiting and Source Respect

ระบบต้องเคารพเว็บไซต์ต้นทาง

Agent ต้อง:

- จำกัด Concurrent Request
- ไม่ดึงหน้าเดิมซ้ำโดยไม่จำเป็น
- Cache ข้อมูลระหว่าง Workflow
- ใช้ RSS หรือ API ก่อน Scraping
- ไม่พยายามหลบระบบป้องกัน Bot
- ไม่ดึงเนื้อหาจาก Paywall
- ไม่ทำ Browser Automation หากไม่จำเป็น
- ไม่ทำ CAPTCHA Bypass
- ไม่โหลดรูปต้นฉบับโดยอัตโนมัติหากไม่มีสิทธิ์

หากเว็บไซต์ไม่อนุญาตให้ดึงเนื้อหา ให้ใช้เฉพาะ Metadata และลิงก์ไปยังต้นฉบับ หรือข้าม Source นั้น

---

## 25. Copyright Rules

ทันเทคเป็นเว็บสรุปข่าว ไม่ใช่เว็บคัดลอกข่าว

ห้าม:

- คัดลอกบทความเต็ม
- คัดลอกหลายย่อหน้าต่อเนื่อง
- นำรูปจากต้นฉบับมาใช้โดยไม่มีสิทธิ์
- ดาวน์โหลดรูปแล้ว Host ใหม่โดยไม่มีสิทธิ์
- ลบชื่อผู้เขียนหรือแหล่งข่าว
- ทำให้ผู้อ่านเข้าใจว่าทันเทคเป็นผู้รายงานต้นฉบับ

ต้อง:

- เขียนสรุปใหม่ด้วยภาษาของทันเทค
- ใส่ลิงก์ต้นฉบับ
- ระบุชื่อ Source
- ใช้ Quote เท่าที่จำเป็น
- แยก Summary ออกจาก Analysis
- ให้เครดิตเจ้าของเนื้อหา

---

## 26. Image Rules

ใน MVP ไม่จำเป็นต้องนำรูปจากต้นฉบับมาใช้

ตัวเลือกที่ปลอดภัยกว่า:

- ภาพ Open Graph จาก Source โดยแสดงผ่าน Remote URL เมื่อได้รับอนุญาต
- ภาพจาก Official Press Kit
- ภาพที่มี License ชัดเจน
- ภาพสร้างขึ้นเอง
- ภาพ Placeholder ตามหมวดหมู่

ทุกภาพต้องมี:

- `alt`
- ขนาดที่เหมาะสม
- Lazy Loading
- Fallback
- Source Attribution เมื่อจำเป็น

---

## 27. SEO Requirements

ทุกหน้าบทความต้องมี:

- Unique Title
- Meta Description
- Canonical URL
- Open Graph Title
- Open Graph Description
- Open Graph Image
- Article Published Time
- Article Section
- Structured Data
- Breadcrumb

Title Template:

```text
{Article Title} | ทันเทค
```

หน้าแรก:

```text
ทันเทค — สรุปข่าวเทคสำคัญ ให้คุณทันทุกวัน
```

Structured Data ใช้:

- `NewsArticle`
- `BreadcrumbList`
- `WebSite`
- `Organization`

---

## 28. Accessibility Requirements

เว็บไซต์ต้องรองรับ:

- Semantic HTML
- Keyboard Navigation
- Visible Focus State
- Correct Heading Hierarchy
- Sufficient Contrast
- Alt Text
- Screen Reader Label
- Reduced Motion
- Responsive Font Size

ห้ามใช้ `<div>` แทน `<button>` หรือ `<a>` เมื่อมี Element ที่เหมาะสม

---

## 29. UI and Design Guidelines

ภาพลักษณ์:

- เรียบง่าย
- ทันสมัย
- อ่านง่าย
- เน้นเนื้อหา
- ดูน่าเชื่อถือ
- ไม่เหมือนเว็บ Clickbait
- ไม่ใช้ Animation มากเกินไป

หน้าแรกควรมี:

1. Header
2. โลโก้ทันเทค
3. Navigation
4. ข่าวเด่น
5. รายการข่าวล่าสุด
6. หมวดหมู่
7. คลังข่าวย้อนหลัง
8. Footer

Article Card ควรแสดง:

- หมวดหมู่
- ชื่อข่าว
- คำอธิบายสั้น
- วันที่
- เวลาอ่าน
- แหล่งข่าว

---

## 30. Responsive Design

ออกแบบ Mobile First

Breakpoint ให้ใช้ค่ามาตรฐานของ Tailwind เท่าที่เป็นไปได้

ตรวจสอบอย่างน้อย:

- 320px
- 375px
- 768px
- 1024px
- 1440px

ห้ามสร้าง Horizontal Scroll โดยไม่ตั้งใจ

---

## 31. Performance Requirements

เป้าหมาย:

- Lighthouse Performance มากกว่า 90
- Accessibility มากกว่า 90
- Best Practices มากกว่า 90
- SEO มากกว่า 90

ควร:

- สร้าง Static HTML
- ลด JavaScript
- Optimize Font
- ใช้ Responsive Image
- Lazy Load รูป
- Avoid Layout Shift
- Minify Assets
- ใช้ CDN
- Cache Static Assets

---

## 32. Security Rules

ห้าม Commit:

- API Key
- Access Token
- Private Key
- Password
- Cookie
- Secret
- `.env`
- Credential File

ใช้ GitHub Actions Secrets เช่น:

```text
AI_API_KEY
GITHUB_TOKEN
```

ต้องมี `.env.example` ที่ไม่มีค่าจริง

ตัวอย่าง:

```env
AI_API_KEY=
AI_MODEL=
SITE_URL=https://tantechnews.com
```

Input จาก RSS, API และ AI ถือเป็น Untrusted Input

ต้อง Validate และ Escape ก่อนแสดงผล

ห้าม Render HTML จาก Source โดยตรง

---

## 33. Logging

ใช้ Structured Logging

ตัวอย่าง:

```ts
logger.info("Article processed", {
  articleId,
  sourceName,
  durationMs,
});
```

Log Level:

- `debug`
- `info`
- `warn`
- `error`

ไม่ควร Log เนื้อหาบทความเต็มหรือ AI Prompt ทั้งหมดใน Production

ควร Log Summary เช่น:

```text
Fetched: 120
Normalized: 116
Duplicates removed: 42
Filtered: 51
Scored: 23
Selected: 7
Generated: 6
Failed: 1
```

---

## 34. Testing Strategy

ใช้ Unit Test สำหรับ Logic สำคัญ:

- URL Normalization
- Hash Generation
- Deduplication
- Score Calculation
- Slug Generation
- Markdown Generation
- Date Formatting
- Content Validation
- Source Parsing

ใช้ Integration Test สำหรับ:

- RSS Feed Parsing
- Article Extraction
- AI Response Parsing
- Full Generation Pipeline

ไม่ต้องเรียก AI API จริงใน Unit Test

ใช้ Mock Response แทน

Agent ต้องเพิ่ม Test เมื่อ:

- เพิ่ม Business Logic
- แก้ Bug
- เพิ่ม Validator
- เพิ่ม Parser
- เปลี่ยน Scoring Rule

---

## 35. Commands

คำสั่งมาตรฐานของโปรเจกต์:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm format
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm news:fetch
pnpm news:generate
pnpm content:validate
```

ก่อนส่งงาน Agent ต้องรันอย่างน้อย:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

หากไม่สามารถรันคำสั่งได้ ต้องระบุเหตุผลอย่างชัดเจน

---

## 36. Git Workflow

Branch Naming:

```text
feature/article-search
fix/article-slug-collision
content/news-2026-08-01
chore/update-dependencies
```

Commit Convention:

```text
feat: add category archive page
fix: prevent duplicate article slugs
content: generate daily news for 2026-08-01
chore: update rss sources
test: add article validator tests
docs: update development guide
```

Agent ห้าม:

- Force Push ไปยัง `main`
- Commit Secret
- ลบไฟล์จำนวนมากโดยไม่มีเหตุผล
- เปลี่ยน Configuration สำคัญโดยไม่อธิบาย
- Rewrite Git History
- Merge Pull Request เองโดยไม่ได้รับคำสั่ง

---

## 37. Pull Request Rules

Pull Request ข่าวประจำวันต้องมีข้อมูล:

```markdown
## Daily News Generation

Date: 2026-08-01

### Summary

- Fetched articles: 120
- Removed duplicates: 42
- Scored articles: 23
- Generated articles: 6
- Failed articles: 1

### Generated Articles

- Article title 1
- Article title 2
- Article title 3

### Review Checklist

- [ ] Titles are accurate
- [ ] Names and numbers match sources
- [ ] Source links work
- [ ] Analysis is separated from facts
- [ ] No duplicate articles
- [ ] Markdown renders correctly
```

---

## 38. GitHub Actions Flow

Workflow สร้างข่าวควรทำงานตามนี้:

```text
Checkout
Setup Node.js
Install Dependencies
Load Sources
Fetch News
Filter News
Score News
Generate Summaries
Validate Content
Create Markdown
Run Tests
Run Build
Create Branch
Commit
Push
Create Pull Request
```

Workflow ต้องรองรับ:

- Scheduled Trigger
- Manual Trigger
- Dry Run
- Specific Date
- Maximum Article Override

ตัวอย่าง Input ที่ควรรองรับ:

```yaml
workflow_dispatch:
  inputs:
    date:
      description: "News date in YYYY-MM-DD"
      required: false
    dry_run:
      description: "Generate without commit"
      type: boolean
      default: true
    max_articles:
      description: "Maximum number of articles"
      required: false
      default: "5"
```

---

## 39. AI Cost Control

Agent ต้องลดค่า AI API โดย:

- กรองด้วย Rule ก่อนเรียก AI
- ส่ง Metadata เพื่อ Scoring
- ดึงบทความเต็มเฉพาะข่าวที่ผ่าน
- จำกัดความยาว Input
- ตัด Navigation และ Footer
- Cache ผลลัพธ์
- ไม่สรุปข่าวซ้ำ
- ใช้โมเดลราคาประหยัดสำหรับ Scoring
- ใช้โมเดลที่มีคุณภาพสูงขึ้นเฉพาะ Summary เมื่อจำเป็น
- จำกัดจำนวน Retry

บันทึก Usage ต่อ Workflow หาก API รองรับ:

```ts
interface AiUsage {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}
```

---

## 40. Retry Policy

ค่าเริ่มต้น:

```ts
const MAX_RETRIES = 2;
```

Retry ได้เมื่อ:

- Network Timeout
- Temporary API Failure
- HTTP 429
- HTTP 5xx
- AI Output ไม่เป็น JSON
- Structured Output ไม่ผ่าน Validation และสามารถแก้ได้

ห้าม Retry แบบไม่จำกัด

เมื่อ AI Validation ไม่ผ่าน:

1. Retry ด้วย Prompt สำหรับซ่อม JSON
2. หากยังไม่ผ่าน ให้ข้ามบทความ
3. บันทึก Error
4. รายงานใน Pull Request

---

## 41. Timezone Rules

Timezone หลักของระบบคือ:

```text
Asia/Bangkok
UTC+07:00
```

ใช้ ISO 8601 สำหรับเก็บวันที่:

```text
2026-08-01T07:00:00+07:00
```

ห้ามใช้ Local Time โดยไม่ระบุ Timezone

ชื่อไฟล์ Daily Digest ใช้วันที่ประเทศไทย

---

## 42. Editorial Review Checklist

ก่อน Publish ผู้ตรวจต้องเช็ก:

- ชื่อข่าวตรงกับต้นฉบับ
- ชื่อบุคคลถูกต้อง
- ชื่อบริษัทถูกต้อง
- ตัวเลขถูกต้อง
- วันที่ถูกต้อง
- ไม่มีข้อมูลแต่งขึ้น
- Source URL เปิดได้
- ไม่มีข่าวซ้ำ
- ไม่มีภาษาประชาสัมพันธ์
- ไม่มีข้อสรุปเกินหลักฐาน
- Analysis แยกจาก Fact
- ไม่มีการละเมิดลิขสิทธิ์
- อ่านเป็นภาษาไทยธรรมชาติ
- ไม่มีคำผิดชัดเจน
- หน้าเว็บแสดงผลถูกต้อง

---

## 43. Definition of Done

งานถือว่าเสร็จเมื่อ:

- Requirement ถูกนำไปใช้ครบ
- Code อ่านง่าย
- TypeScript ไม่มี Error
- Lint ผ่าน
- Test ผ่าน
- Build ผ่าน
- ไม่มี Secret
- ไม่มี Dead Code ที่ไม่จำเป็น
- มี Error Handling
- มี Validation
- รองรับ Mobile
- Accessibility พื้นฐานผ่าน
- Documentation ถูกอัปเดต
- Agent อธิบายไฟล์ที่เปลี่ยน
- Agent ระบุข้อจำกัดหรือสิ่งที่ยังไม่ทำ

---

## 44. Agent Working Rules

เมื่อ Agent ได้รับงาน ต้องทำตามลำดับ:

1. อ่าน `AGENTS.md`
2. อ่าน `README.md`
3. ตรวจสอบโครงสร้างโปรเจกต์
4. ตรวจสอบไฟล์ที่เกี่ยวข้อง
5. สรุป Requirement
6. วางแผนการแก้ไข
7. แก้เฉพาะส่วนที่จำเป็น
8. เพิ่มหรือปรับ Test
9. รัน Validation
10. สรุปผลการเปลี่ยนแปลง

Agent ต้องไม่ถามคำถามเมื่อสามารถอนุมานคำตอบจาก Codebase ได้อย่างปลอดภัย

หาก Requirement ไม่ชัดเจน ให้เลือกแนวทางที่:

- เรียบง่าย
- ปลอดภัย
- ย้อนกลับได้
- ไม่เพิ่ม Scope
- สอดคล้องกับ MVP

Agent ห้าม:

- Refactor ส่วนที่ไม่เกี่ยวข้อง
- เปลี่ยน Stack โดยพลการ
- เพิ่ม Dependency โดยไม่จำเป็น
- สร้าง Abstraction ก่อนมี Use Case
- เพิ่ม Database ใน MVP
- สร้าง Backend API โดยไม่มี Requirement
- เปลี่ยนรูปแบบ Content โดยไม่ Migration
- ลบข้อมูลข่าวเก่า
- Publish ข่าวโดยไม่ผ่าน Validation
- แต่ง Source หรือ Citation

---

## 45. Agent Response Format

หลังทำงาน Agent ควรสรุป:

```text
Summary
- สิ่งที่ทำ

Files Changed
- รายชื่อไฟล์สำคัญ

Validation
- คำสั่งที่รัน
- ผลลัพธ์

Notes
- ข้อจำกัด
- สิ่งที่ควรทำต่อ
```

ห้ามตอบเพียงว่า “Done” โดยไม่มีรายละเอียด

---

## 46. Implementation Priority

ลำดับการพัฒนา:

### Phase 1: Static Website

- Astro Setup
- Layout
- Homepage
- Article Page
- Category Page
- Archive Page
- Content Collection
- SEO
- Responsive Design

### Phase 2: News Collection

- RSS Source Config
- RSS Fetcher
- Normalization
- Deduplication
- Rule-Based Filtering
- Processed Article State

### Phase 3: AI Pipeline

- Article Scoring
- Article Selection
- Content Extraction
- Structured Summarization
- Validation
- Markdown Generation

### Phase 4: Automation

- GitHub Actions
- Scheduled Run
- Branch Creation
- Pull Request Creation
- Validation Workflow

### Phase 5: Production

- Cloudflare Pages
- Custom Domain
- Analytics
- Sitemap
- RSS
- Monitoring
- Error Notification

### Phase 6: Future Features

ทำเมื่อ MVP มีผู้ใช้งานแล้ว:

- Newsletter
- LINE OA
- Telegram Bot
- Personalized Feed
- Bookmark
- User Account
- Paid Subscription
- Mobile App
- Thai Technology Source Integration
- Topic Monitoring
- Company Watchlist

---

## 47. Final Product Principle

ทุกการตัดสินใจต้องย้อนกลับมาที่คำถามนี้:

> สิ่งนี้ช่วยให้ผู้อ่านเข้าใจข่าวเทคโนโลยีที่สำคัญได้เร็วขึ้น ถูกต้องขึ้น และง่ายขึ้นหรือไม่

หากคำตอบคือไม่ ควรตัด Feature หรือ Complexity นั้นออกจาก MVP