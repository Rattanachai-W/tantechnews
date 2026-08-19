---
title: "Vercel เปิดส่งออกเทรซ AI Gateway ผ่าน Vercel Drains"
slug: "vercel-ai-gateway-vercel-drains"
excerpt: "Vercel เพิ่มความสามารถให้ AI Gateway สร้าง OpenTelemetry trace ทุกคำขอ และทีม Pro/Enterprise ส่งออกผ่าน Vercel Drains ไปยังปลายทาง OTLP/HTTP พร้อมการเชื่อมต่อ Braintrust, Dash0, Kubiks, Sentry และ Statsig"
publishedAt: "2026-08-05T12:00:00.000+07:00"
sourcePublishedAt: "2026-08-05T05:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/export-ai-gateway-traces-with-vercel-drains"
author: "TanTech AI Desk"
categories:
  - AI
  - Cloud
  - Data
tags:
  - "Vercel"
  - "AI Gateway"
  - "Vercel Drains"
  - "OpenTelemetry"
  - "OTLP/HTTP"
  - "Braintrust"
  - "Dash0"
  - "Kubiks"
  - "Sentry"
  - "Statsig"
readingTimeMinutes: 1
featured: false
draft: true
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

AI Gateway สร้าง OpenTelemetry trace สำหรับทุกคำขอ ทีม Pro และ Enterprise สามารถส่งออกเทรซผ่าน Vercel Drains ไปยังปลายทางที่รองรับ OTLP/HTTP รวมถึงการเชื่อมต่อ Braintrust, Dash0, Kubiks, Sentry และ Statsig ผู้ใช้ตั้งค่า Trace Drain เลือกโปรเจกต์ และกำหนดอัตราการสุ่มตัวอย่างได้

## ทำไมเรื่องนี้สำคัญ

ข้อมูลเทรซแสดงวงจรชีวิตคำขอทั้งหมด ได้แก่ การเลือกโมเดลและผู้ให้บริการ การสำรองและการลองใหม่ การใช้โทเคนและต้นทุน เวลาถึงโทเคนแรก ระยะเวลาการขอ และสถานะการตอบกลับ พร้อมข้อมูลระบุโปรเจกต์ การดีพลอย คีย์ API สิ่งแวดล้อม และแท็กกำหนดเอง โดยไม่รวมเนื้อหา prompt หรือ completion ทำให้ทีมตรวจสอบประสิทธิภาพและต้นทุน AI Gateway ได้

## ผลกระทบที่น่าจับตา

### สำหรับนักพัฒนา

ติดตามและดีบักคำขอ AI: ตรวจสอบวงจรชีวิตคำขอ AI Gateway ได้ครบถ้วน ตั้งแต่การเลือกโมเดลและผู้ให้บริการ การสำรองและการลองใหม่ การใช้โทเคน ต้นทุน เวลาถึงโทเคนแรก ระยะเวลาการขอ และสถานะการตอบกลับ

### สำหรับธุรกิจ

ควบคุมต้นทุนและประสิทธิภาพ: กำหนดอัตราการสุ่มตัวอย่าง เลือกโปรเจกต์ และดูเหตุการณ์เทรซที่ส่งแล้วตามจำนวน โปรเจกต์ drain หรือแหล่งที่มา ช่วยบริหารข้อมูลการสังเกตการณ์และต้นทุน

### สำหรับสตาร์ทอัพ

เชื่อมต่อเครื่องมือสังเกตการณ์: ทีม Pro และ Enterprise ส่งข้อมูลเทรซไปยัง Braintrust, Dash0, Kubiks, Sentry และ Statsig ได้โดยตรงผ่านปลายทาง OTLP/HTTP

## มุมมองของทันเทค

บทวิเคราะห์: การนำ OpenTelemetry มาใช้กับ AI Gateway ทำให้การสังเกตระบบ AI กลายเป็นส่วนหนึ่งของโครงสร้างพื้นฐานคลาวด์แบบมาตรฐาน ทีมพัฒนาสามารถติดตามการเลือกโมเดล การสำรอง และต้นทุนโทเคนได้แบบครบวงจร โดยไม่ส่งเนื้อหา prompt ออกไป ซึ่งช่วยให้การเปรียบเทียบผู้ให้บริการ AI ชัดเจนขึ้น

## สรุปในประโยคเดียว

> Vercel เปิดให้ทีม Pro และ Enterprise ส่งออก OpenTelemetry trace จาก AI Gateway ผ่าน Vercel Drains ไปยังปลายทาง OTLP/HTTP พร้อมการเชื่อมต่อเครื่องมือสังเกตการณ์หลายตัว

## แหล่งข่าว

[อ่านต้นฉบับ](https://vercel.com/changelog/export-ai-gateway-traces-with-vercel-drains)
