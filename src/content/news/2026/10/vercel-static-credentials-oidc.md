---
title: "Vercel ประกาศยุคสิ้นสุดของ Static Credentials ผลักดัน OIDC เพื่อความปลอดภัยสูงสุด"
slug: "vercel-static-credentials-oidc"
excerpt: "Vercel มุ่งกำจัดความเสี่ยงจาก API Key และรหัสผ่านที่ไม่มีวันหมดอายุ โดยผลักดันการใช้ OIDC เพื่อสร้างระบบยืนยันตัวตนแบบชั่วคราว (Short-lived tokens) ลดโอกาสการถูกโจมตีจากการรั่วไหลของข้อมูลลับ"
publishedAt: "2026-10-22T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-22T04:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/blog/death-to-long-lived-static-credentials"

author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - Cloud
  - Programming
tags:
  - "Vercel"
  - "OIDC"
  - "Cybersecurity"
  - "API Key"
  - "Authentication"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Vercel ประกาศให้ความสำคัญกับการเลิกใช้ Long-lived static credentials (เช่น API keys และรหัสผ่านฐานข้อมูลที่ไม่มีวันหมดอายุ) และเปลี่ยนไปใช้ OpenID Connect (OIDC) แทน โดยได้สร้าง OIDC UI ซึ่งเป็น shadcn/ui registry เพื่อช่วยให้ผู้ให้บริการสร้างฟอร์ม trust-policy และโค้ดตรวจสอบ token ได้ง่ายขึ้น พร้อมทั้งกำหนดข้อกำหนดการยืนยันตัวตนใหม่สำหรับผู้ให้บริการใน Marketplace ของ Vercel

## ทำไมเรื่องนี้สำคัญ

Static credentials มีความเสี่ยงสูงที่จะรั่วไหลผ่าน code repository, แชท, หรือการถูกโจมตีแบบ prompt injection ใน AI agents ซึ่งหากรั่วไหล ผู้โจมตีจะสามารถเข้าถึงระบบได้จนกว่าคีย์จะถูกยกเลิก การเปลี่ยนมาใช้ OIDC จะทำให้แอปพลิเคชันไม่ต้องเก็บคีย์ถาวร แต่ใช้ short-lived token ที่มีอายุจำกัด ซึ่งจะหมดอายุเองโดยอัตโนมัติ ลดความเสียหายหากเกิดการรั่วไหลและลดภาระในการทำ key rotation ที่ซับซ้อน

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** ลดภาระการจัดการความลับ (Secret Management): ไม่ต้องจัดเก็บและหมุนเวียน (rotate) API keys ด้วยตนเอง ลดความเสี่ยงที่ระบบจะล่มจากการเปลี่ยนคีย์ผิดพลาด

- **สำหรับธุรกิจ:** ยกระดับความปลอดภัยของห่วงโซ่อุปทาน (Supply Chain Security): ลดความเสี่ยงจากการถูกโจมตีผ่าน credential theft ซึ่งการเข้ารหัสข้อมูลขณะจัดเก็บ (encryption at rest) เพียงอย่างเดียวไม่สามารถป้องกันได้หากโค้ดอันตรายสามารถอ่านคีย์ใน production ได้

## มุมมองของทันเทค

บทวิเคราะห์: การที่ Vercel ผลักดัน OIDC ให้เป็นมาตรฐานใน Marketplace สะท้อนถึงการเปลี่ยนผ่านจาก 'ความเชื่อใจในตัวคีย์' ไปสู่ 'ความเชื่อใจในตัวตน' (Identity-based trust) ซึ่งเป็นแนวทาง Zero Trust ที่ชัดเจน ผู้อ่านที่เป็นนักพัฒนาควรเริ่มตรวจสอบว่า Service Provider ที่ใช้งานอยู่รองรับ OIDC หรือไม่ เพื่อลดการพึ่งพา Static Keys ในระยะยาว อย่างไรก็ตาม ข้อมูลในบทความยังไม่ได้ระบุถึงขั้นตอนการ Migration สำหรับผู้ใช้เดิมที่ใช้ Static Keys อยู่ว่าจะมีระยะเวลาผ่อนผันหรือมีเครื่องมือช่วยเปลี่ยนผ่านอย่างไร

## สรุปในประโยคเดียว

> Vercel ผลักดันการใช้ OIDC แทน API Key แบบถาวร เพื่อลดความเสี่ยงจากการรั่วไหลของข้อมูลลับและลดภาระการทำ Key Rotation ของนักพัฒนา

## แหล่งข่าว

[อ่านรายงานจาก Vercel Blog](https://vercel.com/blog/death-to-long-lived-static-credentials)
