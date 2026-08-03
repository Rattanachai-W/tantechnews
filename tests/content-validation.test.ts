import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validateDailyReferences,
  validateNewsMarkdownStructure,
  validateProcessedArticleReferences
} from "../scripts/content/validate-content";

const sourceUrl = "https://example.com/source";

const validArticleBody = `## เกิดอะไรขึ้น

มีการประกาศข่าวจากต้นฉบับและสรุปข้อเท็จจริงสำคัญ.

## ทำไมเรื่องนี้สำคัญ

ข่าวนี้มีผลต่อผู้อ่านด้านเทคโนโลยีและควรติดตามต่อ.

## ผลกระทบที่น่าจับตา

### สำหรับนักพัฒนา

ต้องตรวจสอบรายละเอียดก่อนนำไปใช้จริง.

## มุมมองของทันเทค

ส่วนนี้แยกบทวิเคราะห์ออกจากข้อเท็จจริงอย่างชัดเจน.

## สรุปในประโยคเดียว

> ข่าวนี้ควรติดตามจากต้นฉบับ.

## แหล่งข่าว

[อ่านต้นฉบับ](https://example.com/source)
`;

describe("content validation", () => {
  it("accepts the standard news article structure", () => {
    assert.deepEqual(validateNewsMarkdownStructure(validArticleBody, sourceUrl), []);
  });

  it("rejects missing required headings", () => {
    const errors = validateNewsMarkdownStructure(
      validArticleBody.replace("## มุมมองของทันเทค", "## บทวิเคราะห์"),
      sourceUrl
    );

    assert.ok(errors.some((error) => error.includes("missing required heading: มุมมองของทันเทค")));
  });

  it("rejects a source link that does not match frontmatter", () => {
    const errors = validateNewsMarkdownStructure(validArticleBody, "https://example.com/other");

    assert.ok(errors.some((error) => error.includes("source link does not match")));
  });

  it("rejects empty top-level sections", () => {
    const errors = validateNewsMarkdownStructure(
      validArticleBody.replace("ข่าวนี้มีผลต่อผู้อ่านด้านเทคโนโลยีและควรติดตามต่อ.", ""),
      sourceUrl
    );

    assert.ok(errors.some((error) => error.includes("heading has no body content: ทำไมเรื่องนี้สำคัญ")));
  });

  it("accepts a draft digest that references draft articles", () => {
    const errors = validateDailyReferences(
      ["draft-article"],
      true,
      new Map([["draft-article", true]])
    );

    assert.deepEqual(errors, []);
  });

  it("rejects a published digest that references draft articles", () => {
    const errors = validateDailyReferences(
      ["draft-article"],
      false,
      new Map([["draft-article", true]])
    );

    assert.ok(
      errors.some((error) =>
        error.includes("published digest references draft article slug: draft-article")
      )
    );
  });

  it("rejects missing and duplicate daily article references", () => {
    const errors = validateDailyReferences(
      ["published-article", "published-article", "missing-article"],
      false,
      new Map([["published-article", false]])
    );

    assert.ok(errors.some((error) => error.includes("duplicate article slug published-article")));
    assert.ok(
      errors.some((error) => error.includes("referenced article slug does not exist: missing-article"))
    );
  });

  it("accepts processed article slugs that exist in news content", () => {
    const errors = validateProcessedArticleReferences(
      ["existing-article"],
      new Set(["existing-article"])
    );

    assert.deepEqual(errors, []);
  });

  it("rejects processed article slugs that are missing from news content", () => {
    const errors = validateProcessedArticleReferences(
      ["missing-article"],
      new Set(["existing-article"])
    );

    assert.ok(
      errors.some((error) =>
        error.includes("processed article slug does not exist in news content: missing-article")
      )
    );
  });
});
