import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPageTitle, stripBrandSuffix } from "../src/utils/title";

describe("formatPageTitle", () => {
  it("keeps the homepage brand title", () => {
    assert.equal(formatPageTitle(undefined), "ทันเทค | TanTech News");
    assert.equal(formatPageTitle("ทันเทค | TanTech News"), "ทันเทค | TanTech News");
  });

  it("avoids double branding", () => {
    assert.equal(
      formatPageTitle("ข่าวเทคโนโลยีล่าสุด หน้า 2 | ทันเทค"),
      "ข่าวเทคโนโลยีล่าสุด หน้า 2 | TanTech News"
    );
  });

  it("skips brand suffix when title is already long", () => {
    const longTitle =
      "Meta เปิดตัว Muse Ember โมเดลขนาดเล็กเน้นความคุ้มค่าเพื่อการทำงานของ AI Agent";
    const result = formatPageTitle(longTitle);
    assert.equal(result.includes("| TanTech News"), false);
    assert.ok(result.length <= 60);
  });

  it("strips existing brand suffixes", () => {
    assert.equal(stripBrandSuffix("ข่าว AI | TanTech News"), "ข่าว AI");
  });
});
