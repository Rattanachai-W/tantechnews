import { ARTICLE_CATEGORIES, type ArticleCategory } from "../types/article";

export function getCategoryHref(category: ArticleCategory): string {
  return `/category/${category.toLowerCase().replace(/\s+/g, "-")}/`;
}

export function countCategories<T extends { data: { categories: ArticleCategory[] } }>(
  entries: T[]
): Map<ArticleCategory, number> {
  const counts = new Map<ArticleCategory, number>(
    ARTICLE_CATEGORIES.map((category) => [category, 0])
  );

  for (const entry of entries) {
    for (const category of entry.data.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return counts;
}

export const CATEGORY_SEO_DESCRIPTIONS: Record<ArticleCategory, string> = {
  AI: "รวมข่าว AI ล่าสุด ทั้งปัญญาประดิษฐ์ โมเดลภาษา AI Agent งานวิจัย เครื่องมือ AI และการประยุกต์ใช้ในธุรกิจ พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Programming:
    "รวมข่าวการเขียนโปรแกรมล่าสุด ภาษาคอมพิวเตอร์ เฟรมเวิร์ก ไลบรารี เครื่องมือ Developer และแนวทางการพัฒนาซอฟต์แวร์สมัยใหม่ พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Cloud:
    "รวมข่าว Cloud Computing ล่าสุด ครอบคลุม AWS, Google Cloud, Azure, Serverless, DevOps, Kubernetes และสถาปัตยกรรมโครงสร้างพื้นฐาน พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Cybersecurity:
    "รวมข่าวความปลอดภัยทางไซเบอร์ล่าสุด ช่องโหว่ ภัยคุกคาม มัลแวร์ การเจาะระบบ นโยบายความปลอดภัย และวิธีป้องกันข้อมูลสำคัญ พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Startup:
    "รวมข่าวสตาร์ทอัพเทคโนโลยีล่าสุด การระดมทุน โมเดลธุรกิจ ผลิตภัณฑ์นวัตกรรม และการเติบโตของบริษัทเทคเกิดใหม่ทั่วโลก พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Business:
    "รวมข่าวธุรกิจเทคโนโลยีล่าสุด ความเคลื่อนไหวบริษัทยักษ์ใหญ่ การควบรวมกิจการ ผลประกอบการ และกลยุทธ์การแข่งขันในตลาดเทค พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  "Open Source":
    "รวมข่าวโอเพนซอร์สล่าสุด โครงการเปิดตัวใหม่ เครื่องมือและไลบรารีชุมชน การสนับสนุนนักพัฒนา และทิศทาง Open Source ทั่วโลก พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Data: "รวมข่าว Data & Analytics ล่าสุด วิศวกรรมข้อมูล ฐานข้อมูล Big Data, Data Science, Machine Learning Pipeline และเทคโนโลยีจัดการข้อมูล พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Hardware:
    "รวมข่าวฮาร์ดแวร์ล่าสุด ชิปประมวลผล หน่วยประมวลผล AI (GPU/NPU) เซมิคอนดักเตอร์ คอมพิวเตอร์ และอุปกรณ์เทคโนโลยีใหม่ พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Mobile:
    "รวมข่าวเทคโนโลยีมือถือล่าสุด สมาร์ตโฟน แท็บเล็ต ระบบปฏิบัติการ iOS, Android แอปพลิเคชัน และนวัตกรรมอุปกรณ์พกพา พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้",
  Science:
    "รวมข่าววิทยาศาสตร์และเทคโนโลยีขั้นสูง งานวิจัยนวัตกรรม ควอนตัมคอมพิวติง พลังงาน อวกาศ และเทคโนโลยีเปลี่ยนโลก พร้อมแหล่งข่าวต้นฉบับที่ตรวจสอบได้"
};

export function getCategorySeoDescription(category: ArticleCategory): string {
  return (
    CATEGORY_SEO_DESCRIPTIONS[category] ??
    `รวมข่าว ${category} ล่าสุด จากแหล่งข่าวที่ตรวจสอบย้อนกลับได้ อัปเดตโดย TanTech News`
  );
}
