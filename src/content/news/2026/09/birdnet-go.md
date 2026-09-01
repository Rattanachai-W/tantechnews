---
title: "เปลี่ยนกล้องวงจรปิดเป็นระบบระบุชนิดนกอัตโนมัติด้วย BirdNet-Go"
slug: "birdnet-go"
excerpt: "ผู้เขียนใช้กล้อง IP ที่มีอยู่ 3 ตัว รัน BirdNet-Go บน Docker วิเคราะห์เสียงนกและค้างคาวแบบเรียลไทม์บนเครื่องตัวเอง รองรับ RTSP, แจ้งเตือน, ติดตามชนิดใหม่ และแชร์ข้อมูลผ่าน BirdWeather"
publishedAt: "2026-09-01T08:45:55.461+07:00"
sourcePublishedAt: "2026-08-31T16:47:11.000Z"
sourceName: "Hacker News"
sourceUrl: "https://jasontucker.blog/how-i-turned-my-security-cameras-into-an-automatic-bird-identification-system-with-birdnet-go/"
imageUrl: "https://jasontucker.blog/content/images/size/w1200/2026/06/birdnet-2.jpeg"
author: "TanTech AI Desk"
categories:
  - AI
  - Hardware
  - Data
tags:
  - "BirdNet-Go"
  - "Docker"
  - "RTSP"
  - "Home Assistant"
  - "BirdWeather"
  - "AI"
  - "กล้องวงจรปิด"
  - "การระบุชนิดนก"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

ผู้เขียนนำกล้องวงจรปิด IP ที่มีอยู่ 3 ตัว มาใช้ไมโครโฟนเป็นแหล่งเสียงให้ BirdNet-Go ซึ่งรันบน Docker และทำงานแบบ local AI inference 24/7 ระบบวิเคราะห์เสียงทันทีที่นกเริ่มร้อง ระบุชนิดนก ค้างคาว และเริ่มตรวจจับกบได้ รองรับ RTSP, ตั้งกฎแจ้งเตือนตามรายการชนิด, ติดตามชนิดใหม่, เชื่อม Home Assistant ผ่าน MQTT และเลือกแชร์ข้อมูลกับ BirdWeather ได้

## ทำไมเรื่องนี้สำคัญ

สำคัญเพราะแสดงวิธีนำกล้องรักษาความปลอดภัยที่มีอยู่แล้วมาเพิ่มหน้าที่ด้วย AI แบบ self-hosted โดยไม่ต้องซื้อฮาร์ดแวร์ใหม่ ไม่ต้องพึ่งคลาวด์หรือค่ารายเดือน และรองรับโมเดลหลายตัว รวมถึง Google Perch v2 ที่ระบุได้ 14,795 ชนิด เทียบกับ BirdNET 2.4 ที่ 6,000 ชนิด

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** แนวทางทำ local AI pipeline: นักพัฒนาสามารถนำ RTSP, Docker, MQTT และ local inference มาประกอบเป็นระบบตรวจจับเสียงอัตโนมัติใน homelab ได้

- **สำหรับผู้ใช้งาน:** ใช้กล้องเดิมเพิ่มฟีเจอร์: ผู้ใช้บ้านสามารถนำกล้อง IP ที่มีอยู่แล้วมาช่วยระบุชนิดนกและแจ้งเตือนได้โดยไม่ต้องซื้ออุปกรณ์ใหม่

- **สำหรับสังคม:** ข้อมูลเชิงนิเวศจากชุมชน: การแชร์ข้อมูลผ่าน BirdWeather ช่วยสร้างชุดข้อมูลการพบเห็นนกสำหรับนักวิจัยและนักดูนก

## มุมมองของทันเทค

บทวิเคราะห์: แนวคิดนี้ไม่ใช่แค่โปรเจกต์ดูนก แต่เป็นตัวอย่างการเปลี่ยน edge device ที่มีอยู่เป็น sensor สำหรับ AI แบบ self-hosted จุดแข็งคือความเป็นส่วนตัว ความเร็ว และการไม่ผูกกับคลาวด์ ขณะที่การรองรับโมเดลหลายตัวและฐานข้อมูลชนิดนกที่ขยายจาก 6,000 เป็น 14,795 ชนิด ทำให้ระบบนี้ขยายจากงานอดิเรกไปสู่เครื่องมือเก็บข้อมูลเชิงนิเวศได้จริง

## สรุปในประโยคเดียว

> ผู้เขียนใช้กล้องวงจรปิด 3 ตัว รัน BirdNet-Go บน Docker วิเคราะห์เสียงนกและค้างคาวแบบเรียลไทม์บนเครื่องตัวเอง พร้อมแจ้งเตือน ติดตามชนิดใหม่ และแชร์ข้อมูลผ่าน BirdWeather

## แหล่งข่าว

[อ่านต้นฉบับ](https://jasontucker.blog/how-i-turned-my-security-cameras-into-an-automatic-bird-identification-system-with-birdnet-go/)
