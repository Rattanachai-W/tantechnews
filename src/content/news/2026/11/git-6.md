---
title: "Git ประกาศอัปเดตด่วน แก้ไขช่องโหว่ความปลอดภัย 6 รายการ"
slug: "git-6"
excerpt: "Git ปล่อยเวอร์ชันใหม่แก้ไขช่องโหว่ร้ายแรง 6 จุด รวมถึงการรันโค้ดอันตราย (RCE) ระหว่างการ Clone และปัญหา Memory Corruption แนะผู้ใช้รีบอัปเดตเป็นเวอร์ชัน 2.56.1 หรือเวอร์ชัน Patch ล่าสุด"
publishedAt: "2026-11-11T13:12:49.047+07:00"
sourcePublishedAt: "2026-11-10T18:00:00.000Z"
sourceName: "GitHub Blog"
sourceUrl: "https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/"
imageUrl: "https://github.blog/wp-content/uploads/2026/01/generic-security-github-logo-blue.png"
author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - Programming
  - Open Source
tags:
  - "Git"
  - "Cybersecurity"
  - "CVE"
  - "Open Source"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

โปรเจกต์ Git ออกเวอร์ชันใหม่เพื่อแก้ไขช่องโหว่ความปลอดภัย 6 รายการ โดยมีประเด็นสำคัญคือ CVE-2026-111760 ที่ทำให้เกิดการรันโค้ดอันตราย (Arbitrary Code Execution) ผ่านการทำ recursive clone ของ repository ที่ถูกดัดแปลง, CVE-2026-113408 ปัญหา Path traversal จากเซิร์ฟเวอร์ที่ส่งค่า HEAD ปลอม, CVE-2026-114467 และ CVE-2026-105437 ที่ทำให้เกิด Memory/Stack corruption ระหว่างการ Merge หรือลบ Signature และ CVE-2026-114469 ปัญหา Out-of-bounds reads จากการใช้ binary patches ขนาดใหญ่

## ทำไมเรื่องนี้สำคัญ

ช่องโหว่เหล่านี้ส่งผลกระทบโดยตรงต่อความปลอดภัยของเครื่องผู้พัฒนาและระบบ Hosting ที่ให้บริการ Git โดยเฉพาะการรันโค้ดอันตรายที่เกิดขึ้นได้เพียงแค่การ Clone repository และปัญหา Memory corruption ที่อาจนำไปสู่การทำ Denial of Service (DoS) หรือการเข้าถึงข้อมูลในหน่วยความจำ

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** ความเสี่ยงต่อเครื่องทำงาน: ผู้พัฒนาที่ทำการ Clone repository จากแหล่งที่ไม่น่าเชื่อถืออาจถูกรันโค้ดอันตรายในเครื่องได้ผ่านช่องโหว่ recursive clone

- **สำหรับธุรกิจ:** ความเสี่ยงของระบบ Hosting และ CI/CD: ผู้ให้บริการ Hosting ที่ทำการ Merge แทนผู้ใช้ หรือระบบอัตโนมัติที่ประมวลผล Git อาจเผชิญปัญหา Memory corruption และระบบล่ม (DoS)

## มุมมองของทันเทค

บทวิเคราะห์: การพบช่องโหว่ประเภท Integer truncation และ Buffer overflow ในเครื่องมือพื้นฐานอย่าง Git สะท้อนให้เห็นว่าการจัดการหน่วยความจำและข้อมูลนำเข้า (Input Validation) ยังเป็นจุดอ่อนสำคัญ ผู้ใช้ควรตรวจสอบเวอร์ชัน Git ในเครื่องและใน Pipeline ของ CI/CD ทันที โดยอัปเดตเป็น 2.56.1 หรือเวอร์ชัน Patch ตามสายการบำรุงรักษา (Maintenance series) ที่ใช้งานอยู่ ทั้งนี้ ข้อมูลในประกาศยังไม่ได้ระบุถึงจำนวนผู้ที่ได้รับผลกระทบจริงในสภาพแวดล้อมการใช้งานทั่วไป

## สรุปในประโยคเดียว

> Git ออกอัปเดตแก้ไข 6 ช่องโหว่ความปลอดภัยร้ายแรง ทั้งการรันโค้ดอันตรายและการทำ Memory corruption แนะผู้ใช้รีบอัปเดตเป็นเวอร์ชัน 2.56.1

## แหล่งข่าว

[อ่านรายงานจาก GitHub Blog](https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/)
