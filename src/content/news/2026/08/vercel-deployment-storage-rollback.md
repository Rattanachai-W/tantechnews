---
title: "Vercel ระบุ Deployment Storage หนุน Rollback เร็วในไม่กี่วินาที"
slug: "vercel-deployment-storage-rollback"
excerpt: "Vercel ระบุว่าการ deploy แต่ละครั้งสร้างไฟล์ pages, functions และ assets ซึ่ง Deployment Storage จะเก็บไว้ให้ตรวจสอบและ rollback เวอร์ชันก่อนหน้าได้ทันทีโดยไม่ต้อง rebuild พร้อมกำหนด retention policy และคิดค่าเก็บ $0.10 ต่อ GB ต่อเดือน"
publishedAt: "2026-08-22T00:41:11.593+07:00"
sourcePublishedAt: "2026-08-22T05:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/deployment-storage-keeps-your-deployments-rollback-ready"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/gsSX6ZVmOUoz2eg9XIbJh/0798a6d3b19f95fd1fe01c275e6c7c68/image.png"
author: "TanTech AI Desk"
categories:
  - Cloud
  - Business
tags:
  - "Vercel"
  - "Deployment Storage"
  - "Rollback"
  - "Cloud"
  - "Deployment"
  - "Vercel Blob"
  - "Functions Storage"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Vercel ระบุว่าการ deploy แต่ละครั้งสร้างชุดไฟล์ ได้แก่ pages, functions และ assets ที่ Vercel ให้บริการ ซึ่ง Deployment Storage จะเก็บไฟล์เหล่านั้นไว้ให้ตรวจสอบการ deploy ก่อนหน้าและ rollback ได้ หาก production deploy มี bug หรือต้องการย้อนกลับ ผู้ใช้เปิด project แล้วคลิก Instant Rollback บน Production Deployment tile เลือก production deployment ก่อนหน้า Vercel จะชี้โดเมนไปยัง deployment นั้นทันทีโดยไม่ต้อง rebuild

## ทำไมเรื่องนี้สำคัญ

ข้อมูลนี้สำคัญต่อทีมพัฒนาและธุรกิจ เพราะการ rollback production ได้ในไม่กี่วินาทีโดยไม่ต้อง rebuild ช่วยลดเวลาแก้ไขเหตุการณ์ผิดปกติ และควบคุมต้นทุนได้ชัดเจนด้วยราคา $0.10 ต่อ GB ต่อเดือน โดย Hobby teams ได้รับ 10 GB และ existing teams ยังใช้ราคาเดิม

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** Rollback เร็วโดยไม่ต้อง rebuild: ทีมพัฒนาสามารถย้อนกลับ production deployment ที่เกิด bug ได้ในไม่กี่วินาที และตรวจสอบ deployment ก่อนหน้าได้

- **สำหรับธุรกิจ:** ควบคุมต้นทุนและพื้นที่เก็บข้อมูล: ธุรกิจตั้ง retention policy ควบคุมพื้นที่เก็บและต้นทุน พร้อมดู usage ราย project และลดขนาด output, ย้ายไฟล์ใหญ่ไป Vercel Blob หรือลด Function bundle size

## มุมมองของทันเทค

บทวิเคราะห์: Deployment Storage เป็นฟีเจอร์ที่เน้นความต่อเนื่องของระบบมากกว่าความเร็วในการ deploy เพราะการ rollback ได้ทันทีโดยไม่ต้อง rebuild ช่วยลดความเสี่ยงของ production incident และทำให้ทีมสามารถบริหารพื้นที่เก็บข้อมูลกับต้นทุนได้ชัดเจนขึ้นผ่าน retention policy และราคา $0.10 ต่อ GB ต่อเดือน

## สรุปในประโยคเดียว

> Vercel ระบุ Deployment Storage จะเก็บไฟล์จากทุกการ deploy เพื่อให้ rollback production ได้ในไม่กี่วินาทีโดยไม่ต้อง rebuild พร้อมราคา $0.10 ต่อ GB ต่อเดือน

## แหล่งข่าว

[อ่านต้นฉบับ](https://vercel.com/changelog/deployment-storage-keeps-your-deployments-rollback-ready)
