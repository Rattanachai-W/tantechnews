---
title: "SeL4 พิสูจน์ความปลอดภัยครบแล้วบน AArch64"
slug: "sel4-aarch64"
excerpt: "Proofcraft สร้างบทพิสูจน์ว่า seL4 บังคับความลับบน AArch64 ได้ครบแล้ว ครอบคลุมการแยกความปลอดภัยของแอปพลิเคชัน พร้อม MCS บน RISC-V และ Dynamic Domain Scheduler"
publishedAt: "2026-08-25T18:35:21.665+07:00"
sourcePublishedAt: "2026-08-24T11:32:51.000Z"
sourceName: "Hacker News"
sourceUrl: "https://proofcraft.systems/news-2026/"
imageUrl: "http://proofcraft.systems/proofcraft.png"
author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - Programming
tags:
  - "SeL4"
  - "Proofcraft"
  - "AArch64"
  - "RISC-V"
  - "Formal Verification"
  - "Isabelle/HOL"
  - "DARPA PROVERS"
  - "NCSC"
  - "LICS'26"
  - "ความปลอดภัย"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Proofcraft สร้างบทพิสูจน์ว่า seL4 บังคับความลับบน AArch64 ได้จริง หลังจากพิสูจน์ functional correctness และ integrity แล้ว ทำให้บทพิสูจน์ว่าโค้ด seL4 บน AArch64 บังคับ security isolation ของแอปพลิเคชันเสร็จสมบูรณ์ภายใต้สมมติฐานที่ระบุ ด้วยแรงสนับสนุนจาก NCSC นอกจากนี้ Proofcraft นำเสนอผลงาน The Algebra of Iterative Constructions ที่ LICS'26, พิสูจน์ MCS ของ seL4 ถูกต้องบน RISC-V และส่งมอบ Dynamic Domain Scheduler พร้อมบทพิสูจน์

## ทำไมเรื่องนี้สำคัญ

บทพิสูจน์นี้ยืนยันว่า kernel seL4 ป้องกันแอปจากด้านบนไม่ให้เข้าถึงข้อมูลโดยไม่ได้รับอนุญาต และช่วยป้องกันการโจมตีจากแอปที่ไม่สำคัญลุกลามไปกระทบแอปสำคัญ การพิสูจน์ MCS บน RISC-V ยังเกี่ยวข้องกับ mixed-criticality real-time applications เช่น automotive ขณะที่ Dynamic Domain Scheduler ลดข้อจำกัดของ static schedule ที่ทำให้การควบคุมการไหลของข้อมูลใช้ยากในทางปฏิบัติ

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** ลดข้อจำกัดการกำหนดเวลาโดเมน: Dynamic Domain Scheduler ทำให้ไม่ต้องกำหนดเวลาโดเมนแบบตายตัวตลอดอายุระบบ ช่วยให้ผู้พัฒนาใช้การควบคุมการไหลของข้อมูลใน seL4 ได้สะดวกขึ้น

- **สำหรับธุรกิจ:** รองรับระบบ mixed-criticality: MCS ของ seL4 ถูกพิสูจน์ถูกต้องบน RISC-V และจะพอร์ตไป Arm 64-bit ภายใต้ DARPA PROVERS ซึ่งเกี่ยวข้องกับแอปพลิเคชัน real-time เช่น automotive

- **สำหรับสังคม:** ลดความเสี่ยงการโจมตีข้ามแอป: การแยกความปลอดภัยของ seL4 ป้องกันการโจมตีจากแอปที่ไม่สำคัญลุกลามไปกระทบแอปสำคัญ

## มุมมองของทันเทค

บทวิเคราะห์: การปิดบทพิสูจน์ confidentiality บน AArch64 ทำให้ seL4 มีหลักฐานทางคณิตศาสตร์ครบสำหรับ security isolation ภายใต้สมมติฐานที่ระบุ ซึ่งสำคัญต่อระบบที่ต้องการแยกแอปสำคัญออกจากแอปทั่วไป การที่ MCS ถูกพิสูจน์บน RISC-V และจะพอร์ตไป Arm 64-bit ภายใต้ DARPA PROVERS ชี้ว่า Proofcraft ขยายขอบเขต verification จาก kernel พื้นฐานไปสู่ mixed-criticality real-time systems ส่วน Dynamic Domain Scheduler แก้จุดติดของ static scheduling ที่ทำให้ info flow control ใช้ยากในทางปฏิบัติ

## สรุปในประโยคเดียว

> Proofcraft พิสูจน์ seL4 ครบแล้วบน AArch64 ครอบคลุมความลับและการแยกความปลอดภัย พร้อม MCS บน RISC-V และ Dynamic Domain Scheduler ที่ทำให้ควบคุมการไหลของข้อมูลได้ยืดหยุ่นขึ้น

## แหล่งข่าว

[อ่านต้นฉบับ](https://proofcraft.systems/news-2026/)
