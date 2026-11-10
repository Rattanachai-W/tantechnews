---
title: "Cloudflare ลดเวลาอัปเดต DNS ลงครึ่งหนึ่ง พร้อมลดการใช้หน่วยความจำได้ถึง 85%"
slug: "cloudflare-dns-85"
excerpt: "Cloudflare พัฒนาระบบ Targeted Build Planner และ Scheduler ใหม่ ช่วยให้การอัปเดตการตั้งค่า DNS ไม่ต้อง rebuild ข้อมูลทั้งโซน ลดการใช้ Memory และเพิ่มความเร็วในการกระจายข้อมูลสู่ Edge"
publishedAt: "2026-11-02T12:00:00.000+07:00"
sourcePublishedAt: "2026-11-02T14:00:00.000Z"
sourceName: "Cloudflare Blog"
sourceUrl: "https://blog.cloudflare.com/dns-targeted-zone-builds/"
imageUrl: "https://blog.cloudflare.com/_emdash/api/media/file/01M6426V7J1FR4KZEYMQP555R0.01M6426VZJHB2XCKTQ39W2S71Z.png"

author: "TanTech AI Desk"
categories:
  - Cloud
  - Data
tags:
  - "Cloudflare"
  - "DNS"
  - "Infrastructure"
  - "Quicksilver"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Cloudflare ปรับปรุงระบบ Zone Builder โดยการสร้าง Targeted Build Planner เพื่อคำนวณหาขอบเขตการ build ข้อมูลที่เล็กที่สุดที่ปลอดภัย และใช้ Scheduler ใหม่ในการรวมงานของโซนเดียวกัน ส่งผลให้การเปลี่ยนแปลงการตั้งค่าโซน (Zone Settings) ไม่จำเป็นต้องทำการ rebuild ข้อมูลทั้งหมดในโซนที่มีระเบียน (records) หลายสิบล้านรายการ ซึ่งช่วยลดการใช้หน่วยความจำสูงสุดลง 85% และลดระยะเวลาตั้งแต่การเปลี่ยนแปลง DNS จนถึงการเขียนข้อมูลลง Quicksilver ได้ครึ่งหนึ่ง

## ทำไมเรื่องนี้สำคัญ

เนื่องจากปริมาณการเปลี่ยนแปลงระเบียน DNS เพิ่มขึ้นจาก 250 เป็น 700 รายการต่อวินาที และบางโซนมีระเบียนมากกว่า 20 ล้านรายการ การทำ Full Build แบบเดิมไม่สามารถขยายตัว (scale) ได้ทันตามการเติบโตของข้อมูล ซึ่งหากเลือกขอบเขตการ build น้อยเกินไปอาจทำให้ข้อมูลที่ Edge ล้าสมัยหรือไม่ถูกต้อง แต่หากมากเกินไปจะสิ้นเปลืองทรัพยากรระบบ

## ผลกระทบที่น่าจับตา

- **สำหรับธุรกิจ:** การอัปเดตการตั้งค่า DNS รวดเร็วขึ้น: ธุรกิจที่ใช้ Cloudflare จะเห็นผลลัพธ์ของการเปลี่ยนแปลงการตั้งค่า DNS กระจายไปยังเครือข่าย Edge ได้รวดเร็วกว่าเดิม

- **สำหรับนักพัฒนา:** ประสิทธิภาพการจัดการโซนขนาดใหญ่ดีขึ้น: ลดปัญหาคอขวดในการจัดการ DNS Zone ที่มีระเบียนจำนวนมหาศาล (ระดับหลายสิบล้านระเบียน) ให้มีความเสถียรมากขึ้น

## มุมมองของทันเทค

บทวิเคราะห์: การเปลี่ยนจาก Full Build มาเป็น Targeted Build สะท้อนถึงความท้าทายในการจัดการ State ของข้อมูลขนาดใหญ่ที่ต้องรักษาความถูกต้อง (Consistency) ในระดับ Global โดย Cloudflare เลือกแก้ปัญหาที่ตัว Planner และ Scheduler เพื่อลด Redundant Work ซึ่งเป็นแนวทางที่นำไปประยุกต์ใช้ได้กับระบบ Distributed System อื่นๆ ที่มีข้อมูลปริมาณมาก ผู้อ่านที่ดูแลระบบ Infrastructure ขนาดใหญ่สามารถนำแนวคิดการทำ Incremental Update แทน Full Sync มาตรวจสอบเพื่อลด Load ของระบบได้ อย่างไรก็ตาม บทความนี้ยังไม่ได้ระบุรายละเอียดของอัลกอริทึมที่ใช้ตัดสินความ 'ปลอดภัย' (Safe) ในการเลือกขอบเขตการ build ซึ่งเป็นส่วนสำคัญที่สุดของระบบนี้

## สรุปในประโยคเดียว

> Cloudflare เพิ่มประสิทธิภาพการกระจายข้อมูล DNS โดยใช้ระบบ Targeted Build ช่วยลดการใช้ Memory 85% และลดเวลาการอัปเดตข้อมูลลง 50%

## แหล่งข่าว

[อ่านรายงานจาก Cloudflare Blog](https://blog.cloudflare.com/dns-targeted-zone-builds/)
