---
title: "Cloudflare เปิดตัว OAuth scope customization ให้ผู้ใช้เลือกสิทธิ์เฉพาะส่วน"
slug: "cloudflare-oauth-scope-customization"
excerpt: "Cloudflare เปิดตัว OAuth scope customization ให้ผู้พัฒนาตั้งค่า scope เป็น required หรือ optional ได้ ผู้ใช้จึงเลือกอนุญาตสิทธิ์เฉพาะส่วนแทนการกดรับ/ปฏิเสธทั้งก้อน ลดความเสี่ยงการให้สิทธิ์เกินจำเป็น"
publishedAt: "2026-08-21T09:03:48.743+07:00"
sourcePublishedAt: "2026-08-20T17:03:03.000Z"
sourceName: "Cloudflare Blog"
sourceUrl: "https://blog.cloudflare.com/task-based-oauth-consent/"
imageUrl: "https://blog.cloudflare.com/_emdash/api/media/file/01M0E2VZRKNRXQDVWWG4QHHG1B.png"
author: "TanTech AI Desk"
categories:
  - Cloud
  - Cybersecurity
  - Programming
tags:
  - "Cloudflare"
  - "OAuth"
  - "Cloudflare OAuth"
  - "MCP"
  - "API"
  - "ความปลอดภัย"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Cloudflare เปิดตัวฟีเจอร์ OAuth scope customization สำหรับ OAuth client บน Cloudflare โดยผู้พัฒนาสามารถกำหนด scope บางตัวเป็น required หรือ optional ได้ เมื่อผู้ใช้เข้าสู่หน้า consent จะเลือกปิด optional scopes ที่ไม่ต้องการได้ ระบบจะประเมิน required/optional เฉพาะ scope ที่ client ขอใน authorization flow นั้น ไม่ใช่ทุก scope ที่ตั้งค่าไว้ ฟีเจอร์นี้ใช้กับแอปที่มีอยู่เดิมได้

## ทำไมเรื่องนี้สำคัญ

OAuth ช่วยให้แอปพลิเคชันทำงานแทนผู้ใช้โดยไม่ต้องส่งรหัสผ่าน แต่หน้า consent แบบ all-or-nothing ทำให้ผู้ใช้ต้องเลือกให้สิทธิ์ทั้งหมดหรือปฏิเสธทั้งหมด โดยเฉพาะ MCP servers ที่ขอสิทธิ์กว้าง ฟีเจอร์นี้ทำให้ผู้ใช้ควบคุมสิทธิ์ได้ละเอียดขึ้นโดยไม่ทำให้หน้า consent ยาวเกินไป และสอดคล้องกับ OAuth spec ที่อนุญาตให้ authorization server ให้ scope แคบกว่าที่ขอ

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** กำหนดสิทธิ์แบบยืดหยุ่น: ผู้พัฒนา Cloudflare OAuth client สามารถเลือก scope เป็น required/optional ได้ ทำให้แอปขอสิทธิ์เฉพาะที่จำเป็นและลดความจำเป็นในการสร้างหน้าเลือก scope เอง

- **สำหรับผู้ใช้งาน:** ผู้ใช้ควบคุมการอนุญาตได้: ผู้ใช้สามารถ deselect optional scopes ในหน้า consent ได้ หากไม่มี optional scope ประสบการณ์เดิมยังเหมือนเดิม

- **สำหรับธุรกิจ:** ลดความเสี่ยงด้านความปลอดภัย: องค์กร/ธุรกิจที่เชื่อมต่อ SaaS, internal tools, CLI และ agents ผ่าน Cloudflare OAuth สามารถจำกัดสิทธิ์ของ third-party apps ได้ตรงตามการใช้งานจริง

## มุมมองของทันเทค

บทวิเคราะห์: ฟีเจอร์นี้ไม่ใช่การเปลี่ยน OAuth spec แต่เป็นการใช้ช่องว่างของ spec ที่อนุญาตให้ authorization server ให้ scope แคบกว่าที่ขอ มาทำให้ consent screen สอดคล้องกับ workflow ที่ granular ขึ้น จุดสำคัญคือ scope required/optional ถูกประเมินต่อ authorization flow ไม่ใช่ต่อ client ทั้งหมด ซึ่งช่วยป้องกันปัญหาการให้สิทธิ์เกินจริงในกรณี MCP หรือ agents ที่ขอสิทธิ์กว้าง แต่ผู้พัฒนาต้องออกแบบ scope ให้ชัดเจนว่าอะไรจำเป็นจริง ๆ มิฉะนั้น optional scope อาจกลายเป็นสิทธิ์ที่ผู้ใช้กดปิดโดยไม่รู้ความหมาย

## สรุปในประโยคเดียว

> Cloudflare เพิ่ม OAuth scope customization ให้ผู้ใช้เลือกอนุญาตเฉพาะ scope ที่ต้องการแทนการรับ/ปฏิเสธทั้งก้อน

## แหล่งข่าว

[อ่านต้นฉบับ](https://blog.cloudflare.com/task-based-oauth-consent/)
