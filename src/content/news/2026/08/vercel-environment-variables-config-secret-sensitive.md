---
title: "Vercel ปรับ Environment Variables ให้เลือก Config หรือ Secret แทนสวิตช์ Sensitive"
slug: "vercel-environment-variables-config-secret-sensitive"
excerpt: "Vercel ปรับระบบ Environment Variables ให้เลือกประเภท Config หรือ Secret แทนสวิตช์ Sensitive โดย Config อ่านค่าได้หลังบันทึก ส่วน Secret ใช้กับรหัสผ่าน API keys และ tokens โดยสมาชิกดูค่าไม่ได้หลังบันทึก"
publishedAt: "2026-08-25T12:36:48.261+07:00"
sourcePublishedAt: "2026-08-24T00:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/environment-variables-now-use-config-and-secret-types"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5AbVeGQkDXQq4oPCFpWj9q/0683e6b3de3bef9b81b381793ac843b0/env-vars-types.png"
author: "TanTech AI Desk"
categories:
  - Programming
  - Cloud
tags:
  - "Vercel"
  - "Environment Variables"
  - "Config"
  - "Secret"
  - "CLI"
  - "ตัวแปรสภาพแวดล้อม"
  - "ความปลอดภัย"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Vercel เปลี่ยนการเพิ่มหรือแก้ไข Environment Variables ในแดชบอร์ดให้เลือก Config หรือ Secret แทนการเปิดปิด Sensitive โดย Config ยังคงอ่านค่าได้สำหรับสมาชิกที่มีสิทธิ์เข้าถึง ส่วน Secret ยังคงใช้กับ deployments และเปลี่ยนค่าได้ แต่สมาชิกไม่สามารถดูหรือดึงค่าได้หลังบันทึก ตัวแปรเดิมที่ติด Sensitive จะถูกจัดการเป็น Secret โดยอัตโนมัติโดยไม่ต้องย้ายข้อมูล

## ทำไมเรื่องนี้สำคัญ

การแยกประเภท Config และ Secret ช่วยให้ทีมกำหนดสิทธิ์เข้าถึงค่าที่ไม่ลับและค่าลับได้ชัดเจนขึ้น ลดความเสี่ยงจากการตั้งค่าทุกตัวแปรเป็น Sensitive แบบเดิม และเพิ่มนโยบาย Separate Production Secret Values ที่บังคับให้ค่า Production ของ Secret ต่างจากค่าใน Preview, Development และ custom environments

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** จัดการค่าลับและค่าตั้งค่าได้ตรงจุด: นักพัฒนาเลือก Config สำหรับค่าที่ไม่ลับที่ต้องตรวจสอบภายหลัง และ Secret สำหรับรหัสผ่าน API keys หรือ tokens พร้อมใช้ CLI --visibility config/secret

- **สำหรับธุรกิจ:** ควบคุมความปลอดภัยระดับทีม: ทีมปิดนโยบาย Enforce Sensitive Environment Variables เดิม และเปิด Separate Production Secret Values เพื่อบังคับให้ค่า Production ของ Secret ต่างจากค่าในสภาพแวดล้อมอื่น

## มุมมองของทันเทค

บทวิเคราะห์: การเปลี่ยนจาก toggle Sensitive เป็น type Config/Secret ทำให้การจัดการสิทธิ์และค่าลับใน Vercel ชัดเจนขึ้น โดยทีมเดิมไม่ต้อง migration และนโยบาย Separate Production Secret Values ช่วยลดความเสี่ยงจากการใช้ค่าลับ Production ซ้ำใน Preview, Development หรือ custom environments

## สรุปในประโยคเดียว

> Vercel เปลี่ยน Environment Variables ให้เลือก Config หรือ Secret แทน Sensitive toggle พร้อมนโยบายใหม่บังคับให้ค่า Production ของ Secret ต่างจากค่าในสภาพแวดล้อมอื่น

## แหล่งข่าว

[อ่านต้นฉบับ](https://vercel.com/changelog/environment-variables-now-use-config-and-secret-types)
