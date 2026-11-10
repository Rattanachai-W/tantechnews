---
title: "Cloudflare เผยช่องโหว่ร้ายแรง eMudhra ใช้คีย์อ่อนแอระดับวิกฤตจนถูกโจมตี"
slug: "cloudflare-emudhra"
excerpt: "Cloudflare ตรวจพบ eMudhra (CA) ใช้คีย์ส่วนตัวที่อ่อนแออย่างไม่น่าเชื่อ ทำให้ใครก็สามารถกู้คืนคีย์เพื่อปลอมแปลงใบรับรองดิจิทัลได้ ส่งผลให้ eMudhra ประกาศถอนตัวจากธุรกิจ Public CA"
publishedAt: "2026-10-31T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-30T17:38:50.000Z"
sourceName: "Cloudflare Blog"
sourceUrl: "https://blog.cloudflare.com/emudhra-patching/"
imageUrl: "https://blog.cloudflare.com/_emdash/api/media/file/01M66XYMMC146K2EF0FS41ADG9.png"

author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - Cloud
tags:
  - "eMudhra"
  - "Cloudflare"
  - "Certificate Authority"
  - "Cybersecurity"
  - "TLS"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Cloudflare ตรวจพบว่า eMudhra ซึ่งเป็น Certificate Authority (CA) ใช้คีย์ส่วนตัว (Private Keys) ที่อ่อนแออย่างรุนแรงจำนวน 8 ชุด โดยบางชุดเป็นเพียงตัวเลขหลักเดียว เช่น เลข 4 ซึ่งทำให้ผู้ไม่หวังดีสามารถกู้คืนคีย์เหล่านี้จาก Public Certificates ได้ทันทีเพื่อนำไปสร้างใบรับรองปลอมสำหรับโดเมนใดก็ได้ โดย eMudhra ยอมรับว่าเกิดจากความผิดพลาดในสคริปต์สร้างคีย์และประกาศเลิกทำธุรกิจ Public CA

## ทำไมเรื่องนี้สำคัญ

เหตุการณ์นี้แตกต่างจากการรั่วไหลของคีย์ในอดีต เพราะคีย์ที่อ่อนแอทำให้ใครก็ได้ในโลกสามารถกู้คืนคีย์และปลอมแปลงใบรับรองได้โดยไม่ต้องเจาะระบบ ซึ่งหากไคลเอนต์ไม่ได้บังคับใช้ Certificate Transparency จะทำให้การโจมตีแบบ Man-in-the-Middle ประสบความสำเร็จได้ง่าย

## ผลกระทบที่น่าจับตา

- **สำหรับธุรกิจ:** ความเสี่ยงต่อการถูกดักฟังข้อมูล: องค์กรที่ยังไม่ได้ Patch ระบบหรือใช้ไคลเอนต์ที่ไม่ตรวจสอบ Certificate Transparency เสี่ยงต่อการถูกโจมตีด้วยใบรับรองปลอมที่สร้างจากคีย์ของ eMudhra

- **สำหรับนักพัฒนา:** ความจำเป็นในการอัปเดต Trust Store: ต้องเร่งนำคีย์หรือ Root Certificate ของ eMudhra ออกจากระบบ Trust Store เพื่อป้องกันการยอมรับใบรับรองที่ถูกปลอมแปลง

## มุมมองของทันเทค

บทวิเคราะห์: ความผิดพลาดระดับพื้นฐานในการสร้างคีย์ (Key Generation) ของ eMudhra สะท้อนถึงความล้มเหลวของกระบวนการตรวจสอบ (Audit) และการควบคุมคุณภาพของ CA ซึ่งเป็นรากฐานความปลอดภัยของอินเทอร์เน็ต ผู้อ่านควรตรวจสอบว่าระบบของตนมีการบังคับใช้ Certificate Transparency (CT) หรือไม่ เพราะเป็นกลไกสำคัญที่ช่วยตรวจจับใบรับรองปลอมในกรณีที่ Trust Store ยังไม่ได้ถูกอัปเดต ข้อมูลที่ยังขาดคือรายละเอียดของสคริปต์ที่ผิดพลาด ซึ่งหากเปิดเผยจะช่วยให้วงการ Cybersecurity นำไปสร้างแบบทดสอบเพื่อป้องกันความผิดพลาดซ้ำรอยในอนาคตได้

## สรุปในประโยคเดียว

> eMudhra ใช้คีย์สร้างใบรับรองที่อ่อนแอจนใครก็ปลอมแปลงได้ ส่งผลให้ Cloudflare ต้องเร่ง Patch ระบบและ eMudhra ประกาศเลิกธุรกิจ Public CA

## แหล่งข่าว

[อ่านรายงานจาก Cloudflare Blog](https://blog.cloudflare.com/emudhra-patching/)
