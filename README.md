# 📰 ทันเทค (TanTech News)

> **ทันทุกเรื่องเทคที่คุณควรรู้ คัดเฉพาะข่าวสำคัญ สรุปให้เข้าใจง่าย พร้อมวิเคราะห์ผลกระทบ เพื่อให้คุณตามโลกเทคทันในไม่กี่นาที**  
> เว็บไซต์ข่าวเทคโนโลยีภาษาไทยแบบ Static-First ขับเคลื่อนด้วยระบบ AI อัตโนมัติ 100% พร้อมลิงก์ตรวจสอบแหล่งข่าวต้นฉบับ

---

## 📺 วิดีโอสาธิตการใช้งาน (Demo Video)

<!-- วางลิงก์วิดีโอ YouTube ของคุณที่นี่ -->
[![TanTech News Demo](https://img.youtube.com/vi/YOUR_YOUTUBE_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID)

> 💡 *หมายเหตุ: เปลี่ยน `YOUR_YOUTUBE_VIDEO_ID` เป็นรหัสวิดีโอ YouTube ของคุณ*

---

## ✨ จุดเด่นของระบบ (Key Features)

* **🤖 AI News Pipeline อัตโนมัติ:** ดึงข่าวจากสำนักข่าวเทคโนโลยีชั้นนำทั่วโลก (RSS/API) คัดเลือก ให้คะแนนความสำคัญ และสรุปเป็นภาษาไทยอย่างกระชับ
* **⚖️ แยกข้อเท็จจริงและบทวิเคราะห์:** สรุปโครงสร้างข่าวแบบ 3 มิติ (เกิดอะไรขึ้น / มุมมองบทวิเคราะห์ / ใครได้รับผลกระทบ) พร้อมลิงก์ไปยังแหล่งข่าวต้นฉบับทุกบทความ
* **⚡ ความเร็วสูง & Static-First:** ขับเคลื่อนด้วย [Astro](https://astro.build/) หน้าเว็บโหลดเร็ว ประหยัดทรัพยากร และปลอดภัย
* **🔍 ค้นหาข่าวฉับไว (Pagefind):** ระบบค้นหา Full-text Search ทำงานฝั่ง Client ได้ทันทีโดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ฐานข้อมูล
* **📑 ระบบ Pagination & หมวดหมู่ครบครัน:** หน้าแรกแบ่งหน้าอ่านง่าย พร้อมระบบคลังข่าวย้อนหลัง (Archive) สรุปรายวัน (Daily Digest) และแบ่งตาม 11 หมวดหมู่เทคโนโลยี
* **🎯 SEO & Social Sharing สมบูรณ์แบบ:** รองรับ Open Graph รูปภาพอัตโนมัติ, JSON-LD Structured Data, RSS Feed (`/rss.xml`), และ Sitemap (`/sitemap.xml`)
* **⏰ GitHub Actions Automation:** สคริปต์ Cron Job รันสรุปข่าวอัตโนมัติทุกเช้า 05:00 น. (ICT) และอัปเดตขึ้น Production ทันที

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Framework:** [Astro](https://astro.build/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [TailwindCSS](https://tailwindcss.com/)
* **Search Engine:** [Pagefind](https://pagefind.app/)
* **Icons:** [Lucide Astro](https://lucide.dev/)
* **AI Model Gateway:** OpenAI-Compatible API (เช่น Qwen / OpenRouter / 9arm Gateway)
* **Deployment:** [Vercel](https://vercel.com/) / Static Hosting

---

## 🚀 เริ่มต้นใช้งานในเครื่อง (Getting Started)

### 1. โคลนโปรเจกต์และติดตั้ง Dependencies

```bash
git clone https://github.com/your-username/tantechnews.git
cd tantechnews
pnpm install
```

### 2. ตั้งค่าไฟล์สภาพแวดล้อม (.env)

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
AI_API_ENDPOINT=https://xxx.xxx.com/v1/chat/completions
AI_API_KEY=your_api_key_here
AI_MODEL=qwen3.8-27b-fp8
AI_TIMEOUT_MS=120000
AI_MAX_RETRIES=3
```

### 3. รันเซิร์ฟเวอร์ทดสอบ (Development Server)

```bash
pnpm dev
```

เปิดเว็บเบราว์เซอร์ไปที่: `http://localhost:4321`

---

## 📜 คำสั่งที่สำคัญ (Useful Commands)

| คำสั่ง | คำอธิบาย |
| :--- | :--- |
| `pnpm dev` | รัน Local Development Server สำหรับพัฒนา |
| `pnpm build` | ตรวจ Type, คอมไพล์ Static Site และสร้าง Search Index (Pagefind) |
| `pnpm news:generate` | สั่งให้ AI รัน Pipeline ดึงและสรุปข่าวประจำวัน |
| `pnpm news:backfill` | สร้างข่าวย้อนหลัง (เช่น 30 วันที่ผ่านมา) |
| `pnpm validate:content` | ตรวจสอบความถูกต้องของบทความและโครงสร้างไฟล์ |
| `pnpm test` | รัน Unit Tests ทั้งหมดของระบบ Pipeline และ SEO |

---

## 🌐 การ Deploy บน Vercel

1. นำโค้ดขึ้น **GitHub Repository**
2. นำเข้าโปรเจกต์บน [Vercel Dashboard](https://vercel.com/)
3. ตั้งค่า Framework Preset เป็น **Astro** (Vercel จะรันคำสั่ง Build ให้อัตโนมัติ)
4. เพิ่ม **Environment Variables** ในหน้า Settings ของ GitHub Repository เพื่อให้ระบบสร้างข่าวทุกเช้าทำงานได้:
   * `AI_API_ENDPOINT`
   * `AI_API_KEY`
   * `AI_MODEL`

---

## 📄 ลิขสิทธิ์ (License)

โปรเจกต์นี้เปิดให้ใช้งานภายใต้ลิขสิทธิ์ [MIT License](LICENSE)
