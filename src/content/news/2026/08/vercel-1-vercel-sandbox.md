---
title: Vercel เปิดล่าบั๊ก 1 ล้านดอลลาร์ ท้าเจาะ Vercel Sandbox
slug: vercel-1-vercel-sandbox
excerpt: >-
  Vercel เปิด HackerOne 2 สัปดาห์ ท้านักวิจัยเจาะ Vercel Sandbox บน Firecracker
  microVM และ host network controls รางวัลรวมสูงสุด 1 ล้านดอลลาร์สหรัฐ และสูงสุด
  50,000 ดอลลาร์สหรัฐต่อรายงาน
publishedAt: '2026-08-18T20:00:00.000+07:00'
sourcePublishedAt: '2026-08-18T13:00:00.000Z'
sourceName: Vercel Blog
sourceUrl: 'https://vercel.com/blog/one-million-dollar-hacker-challenge-for-vercel-sandbox'
author: TanTech AI Desk
categories:
  - Cybersecurity
  - Cloud
tags:
  - Vercel
  - Vercel Sandbox
  - HackerOne
  - Firecracker
  - microVM
  - sandbox
  - ความปลอดภัย
  - รางวัลบั๊ก
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: TanTech Editorial Desk
imageUrl: >-
  https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/6vJM9naggKRdZrFhTxSN21/30ddbd890d7976e78ee71b9c93cd611f/sandbox-challenge-og.png
---

## เกิดอะไรขึ้น

Vercel เปิดโปรแกรม HackerOne สาธารณะ 2 สัปดาห์ ตั้งแต่วันที่ 18 สิงหาคม ถึง 1 กันยายน 2026 หรือเร็วขึ้นหากใช้เงินหมด เพื่อให้นักวิจัยทดสอบการแยกตัวของ Vercel Sandbox โดยให้รางวัลรวมสูงสุด 1,000,000 ดอลลาร์สหรัฐ และสูงสุด 50,000 ดอลลาร์สหรัฐต่อรายงานสำหรับช่องโหว่ที่ช่วยให้ผู้โจมตีอ่านหรือแก้ไขข้อมูลของ tenant อื่นได้

## ทำไมเรื่องนี้สำคัญ

สำคัญเพราะ Vercel Sandbox เป็นพื้นที่รันโค้ดที่ไม่น่าเชื่อถือสำหรับ agent และ microVM กลายเป็นมาตรฐาน แต่บทความชี้ว่าช่องโหว่ด้าน network boundary สามารถทำให้การแยกตัวล้มเหลวได้ การเปิดทดสอบสาธารณะด้วยรางวัลสูงสุด 1 ล้านดอลลาร์ช่วยให้นักวิจัยตรวจสอบขอบเขต compute และ network ก่อนผู้โจมตี

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** นักพัฒนาต้องทดสอบ sandbox อย่างต่อเนื่อง: Vercel ชี้ว่าผู้ป้องกันมีข้อได้เปรียบก่อน แต่ไม่ถาวร และแนะนำให้สร้างโปรแกรมสแกนด้วยเครื่องมือโอเพนซอร์ส เช่น deepsec และ AI Gateway เพื่อทดสอบขอบเขต sandbox

- **สำหรับธุรกิจ:** ธุรกิจต้องมอง network boundary เป็นส่วนหนึ่งของ isolation: Vercel Sandbox ใช้ Firecracker microVM และ host-side firewall ควบคุม outbound TCP/DNS ตาม domain และ CIDR policies การรั่วไหลด้าน network กระทบข้อมูลของ tenant อื่น

- **สำหรับผู้อ่าน:** นักวิจัยมีช่องทางรายงานช่องโหว่แบบเปิดเผย: โปรแกรม HackerOne เปิดให้ eligible researchers รายงานช่องโหว่ที่ข้าม compute หรือ network boundary ของ Vercel Sandbox โดยให้รางวัลตาม root cause เดียวและ maximum demonstrable impact

## มุมมองของทันเทค

บทวิเคราะห์: Vercel กำลังเปลี่ยนการทดสอบความปลอดภัยจากแบบปิดมาเป็นแบบเปิด โดยให้รางวัลสูงเพื่อเร่งให้นักวิจัยหาช่องโหว่ก่อนผู้โจมตี แนวทางนี้สะท้อนว่า isolation ของ sandbox ต้องพิสูจน์ทั้ง compute และ network boundary พร้อมกัน ไม่ใช่แค่ microVM อย่างเดียว

## สรุปในประโยคเดียว

> Vercel เปิดโปรแกรม HackerOne 2 สัปดาห์ ให้รางวัลรวมสูงสุด 1 ล้านดอลลาร์สหรัฐ เพื่อให้นักวิจัยทดสอบการแยกตัวของ Vercel Sandbox ทั้ง compute และ network boundary

## แหล่งข่าว

[อ่านต้นฉบับ](https://vercel.com/blog/one-million-dollar-hacker-challenge-for-vercel-sandbox)
