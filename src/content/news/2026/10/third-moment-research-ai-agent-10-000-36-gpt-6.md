---
title: "Third Moment Research เผยวิธีรัน AI Agent 10,000 ตัวต่อเนื่อง 36 ชั่วโมงด้วยโมเดล GPT-6"
slug: "third-moment-research-ai-agent-10-000-36-gpt-6"
excerpt: "Third Moment Research พัฒนาระบบ AI ที่ปรับปรุงตัวเองได้ โดยใช้ GPT-6 และ Codex จัดการ Agent จำนวนมหาศาลเพื่อทำวิจัยด้าน Quantitative Finance พร้อมลดเวลา Backtest จาก 3 ชั่วโมงเหลือเพียงไม่กี่นาที"
publishedAt: "2026-10-14T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-14T07:00:00.000Z"
sourceName: "OpenAI Blog"
sourceUrl: "https://openai.com/index/third-moment-research"

author: "TanTech AI Desk"
categories:
  - AI
tags:
  - "OpenAI"
  - "GPT-6"
  - "Codex"
  - "AI Agent"
  - "Quantitative Finance"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Third Moment Research สร้างระบบ AI Agent ที่สามารถปรับปรุงความสามารถได้ด้วยตนเอง โดยใช้โมเดล GPT-6 Astra, GPT-6 Sol และ GPT-6.1 Sol ในการประมวลผล และใช้ Codex ในการวิเคราะห์พฤติกรรม Agent เพื่อสร้างสถานการณ์จำลอง (Synthetic Scenarios) มาแก้ไขจุดอ่อนโดยอัตโนมัติ ซึ่งระบบนี้รองรับการรัน Agent พร้อมกันถึง 10,000 ตัว ต่อเนื่อง 36-48 ชั่วโมง โดยในด้านการเงินเชิงปริมาณ (Quantitative Finance) ทีมงานใช้ Codex วิเคราะห์ Trajectories ของการจำลองจนพบคอขวดในการ Backtest และนำเทคนิค Caching กับ Memory-packing มาใช้ ลดเวลาทำงานจาก 3 ชั่วโมงเหลือเพียง 3-5 นาที

## ทำไมเรื่องนี้สำคัญ

แสดงให้เห็นถึงความสามารถของโมเดลตระกูล GPT-6 ในการรักษาความต่อเนื่องของงานวิจัย (Coherent thread) ได้นานหลายวันโดยไม่หลุดประเด็น และการใช้ AI (Codex) เข้ามาทำหน้าที่เป็นผู้ตรวจสอบและปรับปรุงประสิทธิภาพของระบบ (Optimization) แทนมนุษย์ ซึ่งช่วยลดการสิ้นเปลือง Token และเพิ่มประสิทธิภาพในการใช้ Context Window

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** การจัดการ AI Agent ในสเกลใหญ่: แนวทางการใช้ Dockerized environment ร่วมกับ Codex harness ช่วยให้สามารถควบคุม Agent จำนวนมากและจัดการทรัพยากรข้อมูลระดับ Terabyte ได้อย่างเป็นระบบ

- **สำหรับธุรกิจ:** การลดต้นทุนและเวลาในการประมวลผล: การใช้ AI วิเคราะห์คอขวดของระบบเพื่อทำ Optimization สามารถลดระยะเวลาการทำงานจากหลักชั่วโมงเหลือหลักนาที ซึ่งส่งผลโดยตรงต่อการลดค่าใช้จ่ายด้าน Token

## มุมมองของทันเทค

บทวิเคราะห์: ความสำเร็จของ Third Moment Research เกิดจากการวางโครงสร้างแบบ Layered Architecture ที่แยกส่วน Reasoning (GPT-6) ออกจาก Action/Tooling (Codex harness) และมีระบบ Outer Harness เพื่อตรวจสอบความล้มเหลวของงาน ซึ่งเป็นแนวทางที่นักพัฒนาสามารถนำไปประยุกต์ใช้เพื่อลดปัญหา Agent หยุดทำงานกลางคัน อย่างไรก็ตาม ข้อมูลในบทความยังไม่ได้ระบุถึงต้นทุนรวม (Total Cost) ในการรัน Agent 10,000 ตัว และเกณฑ์การวัดผลความสำเร็จของกลยุทธ์การเทรดที่ AI พัฒนาขึ้น ซึ่งเป็นจุดที่ผู้ที่ต้องการนำไปใช้จริงต้องพิจารณาเพิ่มเติม

## สรุปในประโยคเดียว

> Third Moment Research ใช้ GPT-6 และ Codex รัน AI Agent 10,000 ตัวเพื่อวิจัยการเงิน โดยสามารถลดเวลา Backtest จาก 3 ชั่วโมงเหลือ 3-5 นาทีผ่านการปรับปรุงระบบอัตโนมัติ

## แหล่งข่าว

[อ่านรายงานจาก OpenAI Blog](https://openai.com/index/third-moment-research)
