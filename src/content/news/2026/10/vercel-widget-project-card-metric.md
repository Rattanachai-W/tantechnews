---
title: "Vercel เพิ่มฟีเจอร์ปรับแต่ง Widget บน Project Card ให้เลือกแสดง Metric ได้ตามต้องการ"
slug: "vercel-widget-project-card-metric"
excerpt: "Vercel อัปเดตหน้า Dashboard ให้ผู้ใช้สามารถเลือก Metric ที่ต้องการแสดงบน Project Card ได้รายโปรเจกต์ แทนการแสดงค่า Real Experience Score แบบคงที่ เพื่อให้ทีมติดตามข้อมูลที่สำคัญที่สุดของแต่ละงานได้ทันที"
publishedAt: "2026-10-26T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-26T00:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/customizable-widgets-for-project-cards"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/2YAEANPjhATfsdXhkTAjWa/613806200c6759ddb96a9652b63775fd/widgets-dark-og.png"

author: "TanTech AI Desk"
categories:
  - Cloud
  - Programming
tags:
  - "Vercel"
  - "Dashboard"
  - "Monitoring"
  - "Web Analytics"
  - "Cloud Platform"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Vercel ปรับปรุงแท็บ Overview ใน Dashboard โดยเปลี่ยนจากเดิมที่ Project Card จะแสดงค่า Real Experience Score เพียงอย่างเดียว ให้กลายเป็น Widget ที่ปรับแต่งได้ ผู้ใช้สามารถเลือก Metric จากหมวดหมู่ Firewall (คำขอที่อนุญาต/ปฏิเสธ), Observability (การแจ้งเตือน, Edge requests, Function invocations, Error rate), Speed Insights (Real Experience Score, LCP, CLS) และ Web Analytics (ผู้เข้าชมออนไลน์, จำนวนผู้เข้าชม, Page views) นอกจากนี้ยังสามารถกดเปิดใช้งานฟีเจอร์ Speed Insights Plus, Web Analytics และ alerts ได้โดยตรงจากเมนู Widget

## ทำไมเรื่องนี้สำคัญ

ช่วยให้ทีมพัฒนาสามารถติดตามสัญญาณ (Signal) ที่แตกต่างกันตามประเภทของโปรเจกต์ได้ในหน้าเดียว เช่น โปรเจกต์ที่เน้นความปลอดภัยสามารถเลือกดู Firewall activity ในขณะที่โปรเจกต์การตลาดสามารถเลือกดู Traffic ได้ทันทีโดยไม่ต้องกดเข้าไปในรายละเอียดของแต่ละโปรเจกต์

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** เพิ่มประสิทธิภาพในการ Monitoring: ลดขั้นตอนการเข้าถึงข้อมูลสำคัญรายโปรเจกต์ ทำให้ตรวจพบความผิดปกติหรือติดตามประสิทธิภาพของระบบได้รวดเร็วขึ้นผ่านหน้า Overview

- **สำหรับธุรกิจ:** การบริหารจัดการโปรเจกต์ที่หลากหลายได้ดีขึ้น: ช่วยให้ทีมที่มีโปรเจกต์หลายประเภทสามารถกำหนดตัวชี้วัด (KPIs) ที่เหมาะสมกับเป้าหมายของแต่ละโปรเจกต์ได้อย่างชัดเจน

## มุมมองของทันเทค

บทวิเคราะห์: การเปลี่ยนจาก Static Metric เป็น Customizable Widget สะท้อนถึงการปรับตัวของ Vercel เพื่อรองรับ Enterprise Workflow ที่มีความซับซ้อนขึ้น เนื่องจากแต่ละโปรเจกต์มีเป้าหมายการวัดผลที่ต่างกัน ผู้ใช้งานควรตรวจสอบว่า Metric ใดเป็น Critical Path ของแต่ละโปรเจกต์เพื่อตั้งค่าให้เหมาะสม อย่างไรก็ตาม ข้อมูลในบทความยังไม่ได้ระบุว่าการตั้งค่านี้เป็นแบบ Global สำหรับทั้งทีมหรือเป็นรายบุคคล (Per-user) ซึ่งเป็นจุดที่ผู้ดูแลระบบควรทดสอบเพื่อความเข้าใจในการทำงานร่วมกัน

## สรุปในประโยคเดียว

> Vercel อัปเดตหน้า Dashboard ให้เลือกแสดง Metric สำคัญบน Project Card ได้รายโปรเจกต์ เพื่อการติดตามผลที่ตรงจุดและรวดเร็วยิ่งขึ้น

## แหล่งข่าว

[อ่านรายงานจาก Vercel Blog](https://vercel.com/changelog/customizable-widgets-for-project-cards)
