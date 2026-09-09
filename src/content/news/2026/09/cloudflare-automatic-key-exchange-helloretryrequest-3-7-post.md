---
title: "Cloudflare เปิดตัว Automatic Key Exchange ลด HelloRetryRequest เหลือ 3.7% และดัน post-quantum อัตโนมัติ"
slug: "cloudflare-automatic-key-exchange-helloretryrequest-3-7-post"
excerpt: "Cloudflare เปิดตัว Automatic Key Exchange สำหรับ TLS 1.3 origin connections โดยวัด origin แล้วเลือก key agreement ที่เหมาะสม ลด HelloRetryRequest จาก ~52% เหลือ 3.7% และลด latency p90 กว่า 150 ms"
publishedAt: "2026-09-10T02:41:45.702+07:00"
sourcePublishedAt: "2026-09-08T13:10:00.000Z"
sourceName: "Cloudflare Blog"
sourceUrl: "https://blog.cloudflare.com/automatic-key-exchange-for-origins/"
imageUrl: "https://blog.cloudflare.com/_emdash/api/media/file/01M1PVVA86NJR4N0MTKCH06A9V.01M1PVVAXCHV18R9AZA18HS4AQ.png"
author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - Cloud
tags:
  - "Cloudflare"
  - "Automatic Key Exchange"
  - "TLS 1.3"
  - "post-quantum"
  - "X25519MLKEM768"
  - "HelloRetryRequest"
  - "origin server"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Cloudflare ประกาศเปิดตัว Automatic Key Exchange ซึ่งเป็นส่วนขยายของ Automatic SSL/TLS สำหรับเชื่อมต่อ origin server ใน TLS 1.3 ระบบจะ probe origin เพื่อเรียนรู้ key agreement algorithms ที่รองรับและชอบ จากนั้นเลือก algorithm นั้นใน ClientHello ครั้งแรก โดยให้ความสำคัญกับ post-quantum hybrid X25519MLKEM768 เมื่อ origin รองรับ ระหว่างเปิดใช้งาน HelloRetryRequests ลดจากประมาณ 52% เหลือ 3.7% และลด handshake latency ที่ p90 ลงมากกว่า 150 ms นอกจากนี้มีหลายแสนโดเมนได้ post-quantum origin connections โดยไม่ต้องตั้งค่า

## ทำไมเรื่องนี้สำคัญ

สำคัญเพราะลด handshake จาก 2 round trips เหลือ 1 round trip เมื่อเลือก algorithm ถูก ลด latency p90 กว่า 150 ms และทำให้ post-quantum origin connections ทำงานอัตโนมัติโดยไม่ต้องให้เจ้าของเว็บตั้งค่าเอง ซึ่งช่วยรับมือ harvest-now, decrypt-later และเป้าหมาย quantum-secure ภายใน 2029

## ผลกระทบที่น่าจับตา

- **สำหรับธุรกิจ:** ลด latency และลดการตั้งค่า origin: ธุรกิจที่ใช้ Cloudflare ได้ handshake origin เร็วขึ้น p90 กว่า 150 ms และลด HelloRetryRequest จากประมาณ 52% เหลือ 3.7% โดยไม่ต้องปรับ origin เอง

- **สำหรับนักพัฒนา:** ลดความซับซ้อนด้าน crypto: นักพัฒนาไม่ต้องบังคับ post-quantum ที่ origin หรือตั้งค่า Cloudflare เอง เพราะระบบเลือก X25519MLKEM768 อัตโนมัติเมื่อ origin รองรับ

- **สำหรับผู้ใช้งาน:** เว็บเร็วขึ้นและปลอดภัยระยะยาว: ผู้ใช้ปลายทางได้ connection handshake เร็วขึ้น และได้รับประโยชน์จาก post-quantum origin connections โดยไม่ต้องทำอะไร

## มุมมองของทันเทค

บทวิเคราะห์: จุดแข็งของ Automatic Key Exchange ไม่ใช่แค่การลด latency แต่คือการเปลี่ยน post-quantum จากตัวเลือกที่ต้องตั้งค่าเป็นพฤติกรรมพื้นฐานของ edge network เมื่อ Cloudflare ทำได้กับ origin connections จำนวนมหาศาล จะกดดันให้ผู้ให้บริการและ stack อื่นต้องตาม เพื่อให้ Q-Day ไม่ใช่จุดเปลี่ยนที่ต้องให้ทุกเว็บแก้เอง

## สรุปในประโยคเดียว

> Cloudflare เปิดตัว Automatic Key Exchange ที่วัด origin แล้วเลือก key exchange ถูกตั้งแต่แรก ลด HelloRetryRequest เหลือ 3.7% และเปิด post-quantum อัตโนมัติ

## แหล่งข่าว

[อ่านต้นฉบับ](https://blog.cloudflare.com/automatic-key-exchange-for-origins/)
