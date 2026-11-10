import { visit } from "unist-util-visit";

const HEADING_ID_BY_TEXT = {
  "เกิดอะไรขึ้น": "what-happened",
  "ทำไมเรื่องนี้สำคัญ": "why-it-matters",
  "ผลกระทบที่น่าจับตา": "key-impacts",
  "มุมมองของทันเทค": "tantech-view",
  "สรุปในประโยคเดียว": "one-sentence-summary",
  "แหล่งข่าว": "sources"
};

function toPlainText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (!node.children) return "";
  return node.children.map(toPlainText).join("");
}

/** Rewrite common Thai h2 ids to ASCII so TOC hash jumps work reliably. */
export function rehypeStableHeadingIds() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      const text = toPlainText(node).trim();
      const id = HEADING_ID_BY_TEXT[text];
      if (!id) return;
      node.properties ??= {};
      node.properties.id = id;
    });
  };
}
