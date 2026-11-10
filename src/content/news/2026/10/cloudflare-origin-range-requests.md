---
title: "Cloudflare เปิดตัว Origin Range Requests ปรับปรุงการส่งไฟล์ขนาดใหญ่ให้มีประสิทธิภาพยิ่งขึ้น"
slug: "cloudflare-origin-range-requests"
excerpt: "Cloudflare ยกเครื่องระบบ Cache สำหรับ Range Requests ใหม่ ช่วยลดการดึงข้อมูลส่วนเกินจาก Origin และลดค่า p99 TTFB ของ R2 ลงได้เกือบครึ่ง พร้อมเปิดให้ใช้งานแบบ self-service ทุกแพลน"
publishedAt: "2026-10-24T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-23T18:22:59.000Z"
sourceName: "Cloudflare Blog"
sourceUrl: "https://blog.cloudflare.com/origin-range-requests/"
imageUrl: "https://blog.cloudflare.com/_emdash/api/media/file/01M5MZPB7A2K0S0V8PAH4CRWG6.png"

author: "TanTech AI Desk"
categories:
  - Cloud
tags:
  - "Cloudflare"
  - "CDN"
  - "R2"
  - "HTTP"
  - "Caching"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Cloudflare เปลี่ยนวิธีการจัดการ HTTP range request จากเดิมที่ใช้การแบ่งช่วงข้อมูลขนาดคงที่ (fixed-size ranges) ซึ่งทำให้เกิดปัญหาการดึงข้อมูลเกินความจำเป็นและเกิดคอขวดในการเข้าถึงข้อมูลพร้อมกัน มาเป็นระบบ Origin Range Requests แบบใหม่ที่ให้ Cloudflare จัดการการดึงข้อมูลให้โดยอัตโนมัติผ่าน Cache Rule โดยไม่ต้องตั้งค่าขนาด range เอง

## ทำไมเรื่องนี้สำคัญ

การจัดการ Range Request แบบเดิมสร้าง Trade-off ระหว่างจำนวน request ที่มากเกินไป (หากใช้ range ขนาดเล็ก) กับการสิ้นเปลือง bandwidth และ disk I/O (หากใช้ range ขนาดใหญ่) ซึ่งส่งผลกระทบโดยตรงต่อประสิทธิภาพการสตรีมวิดีโอ การดาวน์โหลดไฟล์ขนาดใหญ่ และการทำงานของ package manager

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** ลดความยุ่งยากในการปรับแต่ง (Tuning): ไม่ต้องตั้งค่า range size หรือติดต่อ support เพื่อปรับจูนการตั้งค่า zone อีกต่อไป สามารถเปิดใช้งานได้ทันทีผ่าน Cache Rule

- **สำหรับธุรกิจ:** เพิ่มประสิทธิภาพการส่งข้อมูลและลดต้นทุน: ลดการสิ้นเปลือง network bandwidth และ disk operations โดยเฉพาะผู้ใช้ R2 ที่พบว่า p99 time to first byte ลดลงประมาณครึ่งหนึ่ง และลด tiered cache traffic ได้ประมาณ 6%

## มุมมองของทันเทค

บทวิเคราะห์: การเปลี่ยนจาก static cache-slicing มาเป็นระบบอัตโนมัติช่วยแก้ปัญหาคอขวดที่เกิดจาก cache key ซึ่งเดิมผูกติดกับขนาดของ range ทำให้การเปลี่ยนค่าส่งผลให้ cache เดิมใช้งานไม่ได้ การที่ Cloudflare เปิดฟีเจอร์นี้ให้ทุกแพลนใช้งานได้แบบ self-service แสดงถึงความพยายามลดความซับซ้อนในการจัดการโครงสร้างพื้นฐานสำหรับผู้ใช้ ผู้ที่ใช้งาน R2 หรือมีการส่งไฟล์ขนาดใหญ่ควรตรวจสอบการตั้งค่า Cache Rule เพื่อเปิดใช้งานฟีเจอร์นี้ อย่างไรก็ตาม ข้อมูลในบทความยังไม่ได้ระบุถึงผลกระทบต่อ latency ในกรณีที่ไฟล์มีขนาดเล็กมากหรือรูปแบบการเรียกข้อมูลที่ซับซ้อนกว่าปกติ

## สรุปในประโยคเดียว

> Cloudflare เปิดตัว Origin Range Requests ระบบจัดการแคชไฟล์ขนาดใหญ่แบบใหม่ที่ลดการสิ้นเปลือง bandwidth และเพิ่มความเร็วในการตอบสนองโดยไม่ต้องตั้งค่า range size เอง

## แหล่งข่าว

[อ่านรายงานจาก Cloudflare Blog](https://blog.cloudflare.com/origin-range-requests/)
