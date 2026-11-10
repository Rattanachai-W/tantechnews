---
title: "Vercel เปลี่ยน Data Cache เป็น Runtime Cache พร้อมปรับโมเดลการคิดค่าบริการ"
slug: "vercel-data-cache-runtime-cache"
excerpt: "Vercel ยกระดับ Data Cache ออกจากช่วง Beta สู่ Runtime Cache เพิ่มพื้นที่จัดเก็บข้อมูลให้โปรเจกต์ระดับ Pro และ Enterprise พร้อมเริ่มคิดค่าบริการตามการใช้งานจริง (Read/Write units)"
publishedAt: "2026-10-30T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-30T04:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/data-cache-is-moving-to-runtime-cache"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/3vVxakIxn4OLYS13ueWDZa/4f4efb6f7e3133ccab12ef7bfd7b02ce/image.png"

author: "TanTech AI Desk"
categories:
  - Cloud
tags:
  - "Vercel"
  - "Next.js"
  - "Runtime Cache"
  - "Cloud Computing"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Vercel ประกาศเปลี่ยน Data Cache เป็น Runtime Cache โดย Next.js fetch caching และ unstable_cache จะเปลี่ยนมาใช้ระบบนี้โดยอัตโนมัติโดยไม่ต้องแก้ไขโค้ด สำหรับผู้ใช้ Pro จะได้รับพื้นที่จัดเก็บแยกตามโปรเจกต์และสภาพแวดล้อมซึ่งเพิ่มขึ้น 8 เท่า และผู้ใช้ Enterprise เพิ่มขึ้น 10 เท่า เมื่อเทียบกับระบบเดิม โดยจะมีการคิดค่าบริการตามจำนวน Read/Write units (เริ่มต้นที่ $0.40 ต่อล้าน read และ $4.00 ต่อล้าน write) สำหรับทีมที่สร้างหลัง 30 ตุลาคม 2026 จะใช้ Runtime Cache ทันที ส่วนทีมเดิมจะทยอยย้ายตามกำหนดการของแต่ละแพ็กเกจ

## ทำไมเรื่องนี้สำคัญ

การเปลี่ยนแปลงนี้เปลี่ยนจากการใช้พื้นที่จัดเก็บแบบรวม (Team-wide pool) มาเป็นแบบแยกรายโปรเจกต์ ซึ่งเพิ่มความยืดหยุ่นและพื้นที่จัดเก็บข้อมูลมากขึ้น แต่ในขณะเดียวกันก็เปลี่ยนรูปแบบการคิดค่าใช้จ่ายจากเดิมที่บางส่วนไม่ถูกเรียกเก็บเงิน มาเป็นการคิดตามปริมาณการอ่านและเขียนข้อมูลจริง

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** การจัดการทรัพยากรและค่าใช้จ่าย: ต้องตรวจสอบการใช้งาน Data Cache ผ่าน Observability และปรับแต่งการอ่าน/เขียนข้อมูลเพื่อลดค่าใช้จ่ายที่อาจเพิ่มขึ้นจากการเปลี่ยนโมเดลราคา

- **สำหรับธุรกิจ:** การวางแผนงบประมาณโครงสร้างพื้นฐาน: ผู้ใช้ระดับ Pro และ Enterprise ต้องเตรียมรับมือกับค่าใช้จ่ายตามการใช้งานจริง (Usage-based pricing) แทนระบบเดิม

## มุมมองของทันเทค

บทวิเคราะห์: การย้ายจาก Data Cache สู่ Runtime Cache สะท้อนถึงการเปลี่ยนผ่านจากช่วงทดลอง (Beta) ไปสู่บริการเชิงพาณิชย์เต็มรูปแบบ โดย Vercel ใช้กลยุทธ์เพิ่มโควตาพื้นที่จัดเก็บเพื่อจูงใจ แต่แลกมาด้วยการคิดค่าบริการตามปริมาณการใช้งาน (Read/Write units) ซึ่งจะส่งผลกระทบโดยตรงต่อแอปพลิเคชันที่มีการเขียน/อ่านแคชในปริมาณสูง ผู้พัฒนาควรใช้ Vercel Agent หรือคู่มือ Optimization เพื่อลดจำนวน Request ที่ไม่จำเป็นก่อนถึงวันย้ายระบบ เพื่อป้องกันค่าใช้จ่ายที่พุ่งสูงขึ้นโดยไม่คาดคิด ทั้งนี้ข้อมูลที่ยังขาดคือรายละเอียดราคาในแต่ละภูมิภาค (Regional rates) ที่ชัดเจนสำหรับผู้ใช้ Pro และ Enterprise

## สรุปในประโยคเดียว

> Vercel เปลี่ยน Data Cache เป็น Runtime Cache เพิ่มพื้นที่จัดเก็บข้อมูลให้มากขึ้น แต่เริ่มคิดค่าบริการตามจำนวนการอ่านและเขียนข้อมูลจริง

## แหล่งข่าว

[อ่านรายงานจาก Vercel Blog](https://vercel.com/changelog/data-cache-is-moving-to-runtime-cache)
