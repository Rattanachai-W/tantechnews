---
title: "Vercel เพิ่มระบบ Liveness Checks ให้กับ Daemons ช่วยรีสตาร์ทคอนเทนเนอร์อัตโนมัติเมื่อระบบค้าง"
slug: "vercel-liveness-checks-daemons"
excerpt: "Vercel อัปเดตฟีเจอร์ให้ Daemons รองรับการตั้งค่า HTTP liveness checks เพื่อตรวจสอบสถานะการทำงานของคอนเทนเนอร์ และสั่งรีสตาร์ททันทีเมื่อตรวจพบว่าระบบไม่ตอบสนองหรือทำงานผิดปกติ"
publishedAt: "2026-10-30T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-30T00:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/add-liveness-checks-to-your-daemons"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/4cesbYYeBiGLzh1fUZG7rM/c03dea6cefe9e8b74d0ebad33b9c1cac/vercel-daemons-liveness-checks-og.jpg"

author: "TanTech AI Desk"
categories:
  - Cloud
  - Programming
tags:
  - "Vercel"
  - "Daemons"
  - "Liveness Check"
  - "Cloud Computing"
  - "Container"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Vercel เพิ่มความสามารถในการกำหนดค่า livenessProbe ให้กับ Daemons โดยผู้ใช้สามารถสร้าง HTTP endpoint ภายใน daemon เพื่อรายงานสถานะสุขภาพ (Health) ของระบบ หาก Vercel ตรวจพบว่า endpoint ดังกล่าวส่งค่า error status กลับมา ระบบจะทำการรีสตาร์ทคอนเทนเนอร์ของ daemon นั้นโดยอัตโนมัติ

## ทำไมเรื่องนี้สำคัญ

ฟีเจอร์นี้ช่วยแก้ปัญหาในกรณีที่ daemon ยังคงมีสถานะ running แต่ไม่สามารถทำงานได้จริง (unhealthy) ซึ่งการตรวจสอบผ่าน HTTP endpoint จะทำให้ระบบสามารถกู้คืนการทำงานได้เองโดยไม่ต้องรอการแทรกแซงจากผู้ดูแลระบบ

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** เพิ่มความเสถียรให้ระบบ Backend: นักพัฒนาสามารถลด Downtime ของ daemon ได้ด้วยการเขียน health check endpoint แบบ lightweight เพื่อให้ Vercel จัดการรีสตาร์ทคอนเทนเนอร์ที่ค้างให้โดยอัตโนมัติ

## มุมมองของทันเทค

บทวิเคราะห์: การนำ livenessProbe มาใช้ช่วยเปลี่ยนจากการตรวจสอบแค่สถานะ Process (Process-level check) มาเป็นการตรวจสอบความพร้อมในการทำงานจริง (Application-level check) ซึ่งจำเป็นมากสำหรับงานประเภท Worker ที่อาจเกิดอาการ Deadlock หรือ Connection Error แม้คอนเทนเนอร์จะยังรันอยู่ ผู้ใช้งานควรตรวจสอบการตั้งค่า default values และ tuning fields ในเอกสารของ Vercel เพื่อปรับจังหวะการตรวจสอบให้เหมาะสมกับโหลดของงาน และควรระวังไม่ให้ health endpoint ทำงานหนักเกินไปจนกลายเป็นภาระของระบบเสียเอง

## สรุปในประโยคเดียว

> Vercel เปิดตัว HTTP liveness checks สำหรับ Daemons เพื่อตรวจจับสถานะสุขภาพของคอนเทนเนอร์และรีสตาร์ทอัตโนมัติเมื่อระบบทำงานผิดปกติ

## แหล่งข่าว

[อ่านรายงานจาก Vercel Blog](https://vercel.com/changelog/add-liveness-checks-to-your-daemons)
