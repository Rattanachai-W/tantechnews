---
title: "เจาะลึกการปรับ Prompt ของ Firefox สำหรับฟีเจอร์ Shake to Summarize ในการสรุปสูตรอาหาร"
slug: "prompt-firefox-shake-to-summarize"
excerpt: "Mozilla เผยเบื้องหลังการทำ Prompt Tuning สำหรับฟีเจอร์ Shake to Summarize บน Firefox โดยเน้นการสร้างคำสั่งเฉพาะตามประเภทเนื้อหา เพื่อให้ LLM ขนาดเล็กสามารถสรุปข้อมูลได้แม่นยำ โดยเฉพาะสูตรอาหารที่ต้องการความละเอียดของวัตถุดิบ"
publishedAt: "2026-10-01T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-01T16:00:00.000Z"
sourceName: "Mozilla Blog"
sourceUrl: "https://blog.mozilla.org/en/firefox/firefox-ai/prompt-tuning-firefox-shake-to-summarize-recipes/"
imageUrl: "https://blog.mozilla.org/wp-content/blogs.dir/278/files/2026/07/Media_AIEnabled_D-1080x720.png"

author: "TanTech AI Desk"
categories:
  - AI
  - Mobile
tags:
  - "Mozilla"
  - "Firefox"
  - "Prompt Tuning"
  - "LLM"
  - "Shake to Summarize"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Mozilla เปิดเผยแนวทางการพัฒนา Prompt สำหรับฟีเจอร์ Shake to Summarize บน iOS และ Android โดยระบุว่าการใช้ LLM ขนาดเล็กจำเป็นต้องมีความเฉพาะเจาะจงสูง ทีมพัฒนาจึงเปลี่ยนจากการใช้คำสั่งสรุปแบบทั่วไป เป็นการสร้างชุดคำสั่งแยกตามประเภทเนื้อหา (Content Type) เช่น สูตรอาหาร (Recipe) ที่ต้องคงรายละเอียดวัตถุดิบและขั้นตอนอย่างครบถ้วน, ข่าว (News) ที่เน้นเหตุการณ์และผลกระทบ, หรือบทวิจารณ์ (Review) ที่เน้นคะแนนและข้อดีข้อเสีย

## ทำไมเรื่องนี้สำคัญ

การใช้ LLM ขนาดเล็กมีข้อจำกัดในการตีความเจตนาที่ไม่ได้ระบุไว้ชัดเจน (reading between the lines) เมื่อเทียบกับโมเดลขนาดใหญ่ การทำ Prompt Tuning โดยกำหนดโครงสร้างผลลัพธ์ตามประเภทเนื้อหาจึงเป็นกลยุทธ์สำคัญที่ทำให้โมเดลขนาดเล็กสามารถส่งมอบข้อมูลที่ผู้ใช้ต้องการได้จริงในบริบทที่แตกต่างกัน

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** แนวทางการปรับแต่ง Prompt สำหรับ Small LLMs: เป็นกรณีศึกษาในการออกแบบ Prompt ที่เน้นความเฉพาะเจาะจง (Specificity) และการแบ่งหมวดหมู่คำสั่งตามประเภทข้อมูล เพื่อเพิ่มประสิทธิภาพให้โมเดลขนาดเล็กทำงานได้ใกล้เคียงกับโมเดลขนาดใหญ่

- **สำหรับผู้ใช้งาน:** ประสบการณ์การใช้งานที่ตรงจุดมากขึ้น: ผู้ใช้ Firefox บนมือถือจะได้รับสรุปเนื้อหาที่เหมาะสมกับประเภทหน้าเว็บ เช่น ได้รายการวัตถุดิบที่ถูกต้องแม่นยำเมื่อสรุปหน้าสูตรอาหาร แทนที่จะเป็นบทสรุปแบบกว้างๆ

## มุมมองของทันเทค

บทวิเคราะห์: การที่ Mozilla เลือกใช้แนวทาง 'Identify and Adapt' โดยแยก Prompt ตามประเภทเนื้อหา สะท้อนให้เห็นถึงข้อจำกัดของ Small LLMs ในด้านการอนุมานบริบท ซึ่งการแก้ปัญหาด้วยการสร้าง Rule-based Prompting แบบนี้ช่วยลดโอกาสเกิด Hallucination ในข้อมูลสำคัญ (เช่น ปริมาณวัตถุดิบ) ได้ดีกว่าคำสั่งกว้างๆ ผู้อ่านที่พัฒนา AI Application สามารถนำแนวทางนี้ไปปรับใช้กับโดเมนเฉพาะทางได้ โดยสิ่งที่ยังขาดในบทความนี้คือเกณฑ์การวัดผล (Evaluation Metric) ที่ชัดเจนว่าการแยก Prompt ช่วยเพิ่มความแม่นยำขึ้นกี่เปอร์เซ็นต์เมื่อเทียบกับ Prompt เดียว

## สรุปในประโยคเดียว

> Mozilla เผยเทคนิคการทำ Prompt Tuning สำหรับฟีเจอร์ Shake to Summarize โดยแยกคำสั่งตามประเภทเนื้อหาเพื่อให้ LLM ขนาดเล็กสรุปข้อมูลได้แม่นยำและตรงความต้องการของผู้ใช้

## แหล่งข่าว

[อ่านรายงานจาก Mozilla Blog](https://blog.mozilla.org/en/firefox/firefox-ai/prompt-tuning-firefox-shake-to-summarize-recipes/)
