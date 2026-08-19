---
title: "OpenAI เผย 2 การตั้งค่า API เพิ่มคะแนน GPT-5.6 Sol บน ARC-AGI-3 เป็น 3 เท่า"
slug: "openai-2-api-gpt-5-6-sol-arc-agi-3-3"
excerpt: "OpenAI พบว่าการเปิด retained reasoning และ compaction ใน Responses API ทำให้ GPT-5.6 Sol ได้คะแนน 38.3% จาก 13.3% บนชุดงานสาธารณะของ ARC-AGI-3 และลด output tokens ลง 6 เท่า"
publishedAt: "2026-07-29T12:00:00.000+07:00"
sourcePublishedAt: "2026-07-29T15:00:00.000Z"
sourceName: "OpenAI Blog"
sourceUrl: "https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores"
author: "TanTech AI Desk"
categories:
  - AI
  - Programming
tags:
  - "OpenAI"
  - "GPT-5.6 Sol"
  - "ARC-AGI-3"
  - "Responses API"
  - "retained reasoning"
  - "compaction"
  - "การตั้งค่า API"
  - "การประเมิน AI"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

OpenAI รายงานว่า GPT-5.6 Sol ได้คะแนน 13.3% บนชุดงานสาธารณะของ ARC-AGI-3 เมื่อใช้ harness ทางการ แต่เมื่อเปิด retained reasoning และ compaction ใน Responses API คะแนนเพิ่มขึ้นเป็น 38.3% และลด output tokens ลง 6 เท่า โดย ARC-AGI-3 วัด Relative Human Action Efficiency (RHAE) เทียบกับฐานมนุษย์ที่ประมาณ 48%

## ทำไมเรื่องนี้สำคัญ

ผลนี้สำคัญเพราะคะแนน benchmark ไม่ได้วัดเฉพาะความสามารถของโมเดลเท่านั้น แต่ยังสะท้อนการตั้งค่า API การออกแบบ harness และ prompting ด้วย การเลือกเปิด retained reasoning และ compaction จึงเปลี่ยนผลลัพธ์จาก 13.3% เป็น 38.3% และทำให้การเปรียบเทียบโมเดลต้องคำนึงถึงสภาพแวดล้อมการทดสอบ

## ผลกระทบที่น่าจับตา

### สำหรับนักพัฒนา

การตั้งค่า API มีผลต่อผลประเมิน: developers ที่ทดสอบ agent บน ARC-AGI-3 ต้องพิจารณา retained reasoning และ compaction เพราะการตั้งค่าเหล่านี้ทำให้คะแนน GPT-5.6 Sol เปลี่ยนจาก 13.3% เป็น 38.3% และลด output tokens ลง 6 เท่า

### สำหรับธุรกิจ

การเลือก harness ส่งผลต่อการวัดประสิทธิภาพ: businesses ที่ประเมิน AI agent ต้องคำนึงว่า harness ทางการที่ตัด private reasoning และใช้ rolling truncation window ทำให้โมเดลจำการคิดและอดีตไม่ได้ ซึ่ง OpenAI พบว่าเป็นสาเหตุสำคัญที่ทำให้คะแนนต่ำ

### สำหรับผู้อ่าน

การออกแบบ benchmark ต้องเปิดเผยเงื่อนไข: ARC-AGI-3 ใช้ harness แบบทั่วไปโดยไม่มีเครื่องมือหรือฟีเจอร์พิเศษ เพื่อให้ข้อจำกัดของโมเดลปรากฏชัด แต่ผลของ OpenAI แสดงว่าเงื่อนไขการทดสอบมีผลต่อคะแนนอย่างมีนัยสำคัญ

## มุมมองของทันเทค

บทวิเคราะห์: ข่าวนี้ชี้ว่าคะแนน benchmark ของ AI agent ถูกกำหนดโดยสภาพแวดล้อมการทดสอบร่วมกับความสามารถของโมเดล การที่ retained reasoning และ compaction เพิ่มคะแนนเป็น 3 เท่าและลด output tokens ลง 6 เท่า แสดงว่าระบบที่เก็บเหตุผลและสรุปประวัติได้สำคัญต่อการเรียนรู้ในเกมที่ไม่คุ้นเคย สำหรับผู้พัฒนา การเปิดเผย harness และการตั้งค่าจะช่วยให้การเปรียบเทียบโมเดลมีความหมายมากขึ้น

## สรุปในประโยคเดียว

> OpenAI พบว่าการเปิด retained reasoning และ compaction ใน Responses API ทำให้ GPT-5.6 Sol ได้คะแนน ARC-AGI-3 สูงขึ้นจาก 13.3% เป็น 38.3% และลด output tokens ลง 6 เท่า

## แหล่งข่าว

[อ่านต้นฉบับ](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores)

