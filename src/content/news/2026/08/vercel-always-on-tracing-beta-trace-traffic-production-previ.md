---
title: "Vercel เปิด Always-on tracing beta เก็บ trace จาก traffic จริงใน Production และ Preview"
slug: "vercel-always-on-tracing-beta-trace-traffic-production-previ"
excerpt: "Vercel เปิดตัว Always-on tracing ในสถานะ beta ให้ทีมทุกแผนเก็บ trace จาก traffic จริงใน Production และ Preview ได้ต่อเนื่อง ตั้งค่า sampling rule ราย environment หรือ path prefix ได้ และคิดราคา $0.50 ต่อ 1 ล้าน span units"
publishedAt: "2026-08-22T13:13:37.574+07:00"
sourcePublishedAt: "2026-08-21T00:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/always-on-tracing-for-production-and-preview-traffic"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/HPhn9pntS6skI90XakRaL/e7fcce99b41c5fb1c450c8675e7f1c76/og-always-on-tracing.png"
author: "TanTech AI Desk"
categories:
  - Cloud
tags:
  - "Vercel"
  - "Always-on tracing"
  - "Observability"
  - "Tracing"
  - "Cloud"
  - "Production"
  - "Preview"
  - "@vercel/otel"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Vercel เพิ่ม Always-on tracing ในสถานะ beta สำหรับทีมทุกแผน โดยระบบจะเก็บ trace จาก production และ preview traffic ต่อเนื่อง ต่างจาก session tracing ที่เก็บเฉพาะ request จากเบราว์เซอร์ของผู้ใช้เอง ผู้ใช้สามารถกำหนด sampling rule เพื่อตั้ง trace rate ราย environment ได้แก่ All, Production หรือ Preview และกำหนดขอบเขตตาม path prefix เช่น /checkout ได้ ระบบจะไม่เก็บข้อมูลจนกว่าจะเพิ่ม rule และจะเก็บ infrastructure และ outbound fetch spans อัตโนมัติ ส่วน framework และ custom spans ต้อง instrument แอปด้วย @vercel/otel การดู trace ทำได้ผ่าน Logs หรือคำสั่ง vercel traces get <request-id>

## ทำไมเรื่องนี้สำคัญ

ฟีเจอร์นี้ช่วยให้ทีมพัฒนา debug request ของผู้ใช้จริงโดยไม่ต้องสร้างสถานการณ์ซ้ำ เพราะเก็บ live traffic ต่อเนื่องและควบคุมการเก็บด้วย sampling rule ได้เฉพาะทาง เช่น /checkout ทำให้ควบคุมค่าใช้จ่ายจากการจ่ายเฉพาะส่วนที่เลือก trace ที่ราคา $0.50 ต่อ 1 ล้าน span units พร้อมกำหนด retention ตามแผนคือ Hobby 1 ชั่วโมง Pro 1 วัน และ Enterprise 3 วัน

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** Debug request จริงได้โดยไม่ต้องจำลองซ้ำ: ทีมพัฒนาสามารถดู trace จาก production และ preview traffic จริง ตั้งค่า sampling rule ราย environment หรือ path prefix และเรียกดู trace ผ่าน Logs หรือคำสั่ง vercel traces get <request-id>

- **สำหรับธุรกิจ:** ควบคุมต้นทุน observability ได้ตาม traffic ที่เลือก: ระบบไม่เก็บข้อมูลจนกว่าจะเพิ่ม sampling rule ทำให้ธุรกิจจ่ายเฉพาะส่วนที่เลือก trace ในราคา $0.50 ต่อ 1 ล้าน span units และกำหนด retention ตามแผนได้

## มุมมองของทันเทค

บทวิเคราะห์: Always-on tracing ของ Vercel ย้าย observability จากแบบ session-based มาเป็น live sampling ที่ควบคุมได้จริงใน production และ preview จุดแข็งคือ sampling rule ที่เจาะจง environment และ path prefix ทำให้ทีมพัฒนาเลือกเก็บเฉพาะเส้นทางสำคัญ เช่น /checkout และจ่ายเฉพาะส่วนที่เลือก trace การที่ infrastructure และ outbound fetch spans ถูกเก็บอัตโนมัติช่วยให้เริ่มใช้ได้ง่ายขึ้น แต่การเพิ่ม framework และ custom spans ยังต้อง instrument ด้วย @vercel/otel ซึ่งต้องกำหนดในแอปด้วย

## สรุปในประโยคเดียว

> Vercel เพิ่ม Always-on tracing beta ให้ทีมทุกแผนเก็บ trace จาก production และ preview traffic จริงได้ต่อเนื่อง ตั้งค่า sampling rule และจ่ายตาม span units ที่เลือก

## แหล่งข่าว

[อ่านต้นฉบับ](https://vercel.com/changelog/always-on-tracing-for-production-and-preview-traffic)
