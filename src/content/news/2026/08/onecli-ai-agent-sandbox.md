---
title: "OneCLI เปิดตัวแพลตฟอร์มโอเพนซอร์สสำหรับทีม AI Agent แบบ Sandbox"
slug: "onecli-ai-agent-sandbox"
excerpt: "OneCLI (YC S26) เป็นแพลตฟอร์มโอเพนซอร์สสำหรับรัน AI Agent แบบทีม ให้พนักงานแต่ละคนมี agent ใน sandbox พร้อม gateway ควบคุมสิทธิ์และ credentials"
publishedAt: "2026-08-19T23:29:02.000+07:00"
sourcePublishedAt: "2026-08-19T16:29:02.000Z"
sourceName: "Hacker News"
sourceUrl: "https://github.com/onecli/onecli"
author: "TanTech AI Desk"
categories:
  - AI
  - Open Source
  - Cybersecurity
tags:
  - "OneCLI"
  - "AI Agent"
  - "Open Source"
  - "Sandbox"
  - "Credential Management"
  - "Y Combinator"
  - "Hacker News"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

OneCLI เปิดตัว OneCLI v2 เป็นแพลตฟอร์มโอเพนซอร์สสำหรับรัน AI Agent แบบทีม โดยสร้าง agent รายบุคคลให้ทำงานใน sandbox และใช้ gateway ควบคุมสิทธิ์ credentials รวมถึงรองรับ IdP, Slack, human-in-the-loop approvals, และรันบนโครงสร้างพื้นฐานของตนเอง

## ทำไมเรื่องนี้สำคัญ

สำคัญเพราะทีมที่ใช้งาน autonomous agents ต้องการควบคุม secrets, permissions และการจัดการหลาย agent ในที่เดียว OneCLI ให้ agent รายบุคคล, policy กลาง, approvals ในแชท, และ runner outbound-only ที่ทำงานหลัง NAT ได้

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** จัดการ agent รายบุคคลง่ายขึ้น: นักพัฒนาสร้าง agent พร้อม sandbox, shell, memory, skills, schedule และเชื่อม Slack โดยไม่ต้องจัดการ secrets โดยตรง

- **สำหรับธุรกิจ:** ควบคุมสิทธิ์และ policy ในที่เดียว: องค์กรกำหนด policy กลาง, เชื่อม IdP, อนุมัติงานสำคัญแบบ human-in-the-loop และใช้ LLM keys หรือ service accounts แบบไม่ส่งให้ agent โดยตรง

- **สำหรับสตาร์ทอัพ:** ทางเลือกสำหรับทีมที่สร้าง agent: OneCLI เป็น open-source และ self-hosted รองรับ cloud-hosted ที่ onecli.sh จึงเป็นตัวเลือกสำหรับทีมที่ต้องการ agent harness

## มุมมองของทันเทค

บทวิเคราะห์: OneCLI ชี้ว่า autonomous agents ส่วนใหญ่ถูกสร้างสำหรับผู้ใช้คนเดียว แต่เมื่อขยายเป็นทีมจะติดปัญหา secrets, permissions และการจัดการหลาย agent การเน้น sandbox, gateway, IdP และ approvals ในแชทจึงตอบโจทย์ governance สำหรับองค์กรมากกว่าการเพิ่มความสามารถของ agent อย่างเดียว

## สรุปในประโยคเดียว

> OneCLI เป็นแพลตฟอร์มโอเพนซอร์สสำหรับทีม AI Agent ที่ให้ agent รายบุคคลใน sandbox พร้อม gateway ควบคุมสิทธิ์ credentials และ policy กลาง

## แหล่งข่าว

[อ่านต้นฉบับ](https://github.com/onecli/onecli)
