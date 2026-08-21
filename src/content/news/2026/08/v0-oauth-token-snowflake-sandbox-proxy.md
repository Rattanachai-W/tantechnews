---
title: "v0 แยก OAuth Token ของผู้ใช้ Snowflake ออกจาก Sandbox ด้วย Proxy ภายนอก"
slug: "v0-oauth-token-snowflake-sandbox-proxy"
excerpt: "v0 แก้ปัญหาการเข้าถึง Snowflake ของแอปที่ AI สร้าง โดยไม่ส่ง OAuth Token ของผู้ใช้เข้า Sandbox ผ่าน Proxy ภายนอกที่ตรวจสอบ OIDC และดึง credential ใหม่ในขั้นตอน request"
publishedAt: "2026-08-20T11:00:00.000+07:00"
sourcePublishedAt: "2026-08-20T04:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/blog/how-v0-authenticates-to-snowflake-without-exposing-the-users-oauth-token"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/odgbeRfzLWYL6oZce95kx/91098547db15b7070919776f984dda62/how_v0_protects_snowflake_secrets_in_code_generati_og_card_1_.jpg"
author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - AI
  - Cloud
tags:
  - "v0"
  - "Snowflake"
  - "Vercel"
  - "OAuth"
  - "Sandbox"
  - "Prompt Injection"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Vercel อธิบายว่า v0 สร้าง Snowflake request proxy สำหรับ sandbox บน Vercel Sandbox firewall เพื่อให้โค้ดที่ AI สร้างสามารถเรียกใช้ Snowflake clients ได้ โดย sandbox ไม่สามารถเชื่อมต่อ Snowflake โดยตรง ไฟวอลล์จะ forward request ไปยัง proxy ภายนอก proxy ตรวจสอบ OIDC token ของ sandbox ค้นหา v0 chat ที่เกี่ยวข้อง ฟื้น user session และดึง Snowflake credential ใหม่ในขั้นตอน request credential ถูก resolve ภายนอก sandbox runtime เท่านั้น

## ทำไมเรื่องนี้สำคัญ

สำคัญเพราะแอปที่ AI สร้างเสี่ยงถูก prompt injection ให้ขโมยข้อมูล ถ้า credential อยู่ใน sandbox แม้ isolation ก็ไม่ช่วย เพราะ token อาจถูกเขียนลง log ส่งกลับ API response หรือฝังใน client code วิธีนี้ทำให้ผู้ใช้เชื่อม Snowflake เพื่อ inspect schema และ query data ได้ โดย generated code ไม่ได้รับ raw provider credentials

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** พัฒนาแอปที่เชื่อม Snowflake ปลอดภัยขึ้น: นักพัฒนาสามารถใช้ Snowflake SDK และ CLI ใน sandbox ได้โดยไม่ต้องจัดการ credential เอง และลดความเสี่ยงที่โค้ดที่โมเดลสร้างจะเข้าถึง token

- **สำหรับธุรกิจ:** ลดความเสี่ยงข้อมูลรั่วจาก AI-generated apps: องค์กรที่เชื่อม warehouse เข้ากับ v0 สามารถให้ผู้ใช้สำรวจข้อมูลตามสิทธิ์ Snowflake role โดยไม่ส่ง raw credentials ให้โค้ดที่รันโดยไม่มี human review

## มุมมองของทันเทค

บทวิเคราะห์: แนวคิดนี้ชี้ว่า isolation อย่างเดียวไม่พอสำหรับ AI-generated code เพราะ secret ที่อยู่ใน sandbox ถือว่ารั่วแล้ว การย้าย credential resolution ไปยัง proxy ภายนอกและใช้ per-sandbox CA เพื่อ TLS termination ทำให้รักษา compatibility ของ Snowflake clients ได้โดยไม่ trust host จากโค้ดที่สร้าง แต่ต้องระวังความซับซ้อนของ trust boundary, certificate management และ scope ของ proxy ที่ต้องผูกกับ chat/session อย่างแม่นยำ

## สรุปในประโยคเดียว

> v0 ใช้ Snowflake request proxy ภายนอก sandbox เพื่อตรวจสอบ OIDC และดึง credential ใหม่ในขั้นตอน request ทำให้แอปที่ AI สร้างเรียก Snowflake ได้โดยไม่ได้รับ OAuth Token ของผู้ใช้

## แหล่งข่าว

[อ่านต้นฉบับ](https://vercel.com/blog/how-v0-authenticates-to-snowflake-without-exposing-the-users-oauth-token)
