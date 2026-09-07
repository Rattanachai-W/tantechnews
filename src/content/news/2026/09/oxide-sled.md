---
title: "Oxide เผยกลยุทธ์ลำดับชั้นกุญแจระดับแร็ค ป้องกันการขโมยข้อมูลจาก sled และไดรฟ์"
slug: "oxide-sled"
excerpt: "Oxide อธิบาย RFD 0301 ว่าใช้ Shamir Secret Sharing แบ่ง secret ระดับแร็คเป็น N ส่วน เก็บใน M.2 ของ sled แต่ละตัว ต้องรวม K ส่วนจึงกู้คืนได้ เพื่อป้องกันผู้โจมตีขโมย sled หรือไดรฟ์บางส่วนแล้วเข้าถึงข้อมูล"
publishedAt: "2026-09-07T17:02:53.874+07:00"
sourcePublishedAt: "2026-09-07T02:14:59.000Z"
sourceName: "Hacker News"
sourceUrl: "https://rfd.shared.oxide.computer/rfd/0301"

author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - Hardware
tags:
  - "Oxide"
  - "RFD 0301"
  - "rack-level security"
  - "Shamir Secret Sharing"
  - "RoT"
  - "sled"
  - "sprockets"
  - "U.2"
  - "M.2"
  - "Trust Quorum"
readingTimeMinutes: 2
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Oxide เผย RFD 0301 ที่อธิบายกลยุทธ์ลำดับชั้นกุญแจสำหรับความปลอดภัยระดับแร็ค โดยระบบใช้ DeviceId และ Alias keys บน RoT สำหรับ platform identity และ measurement signing สำหรับ attestation พร้อม keypair บน RoT สำหรับ authenticating ephemeral Diffie-Hellman agreement เพื่อให้ sled สร้าง secure sprockets sessions แบบ point-to-point ที่ปกป้องความถูกต้องของข้อความ ตรวจสอบตัวตน endpoint และ attestation ซอฟต์แวร์ที่ทำงาน ระบบใช้ Trust Quorum และ Shamir Secret Sharing แบ่ง rack-level secret เป็น N key shares โดย dealer process แจกผ่าน sprockets sessions ไปยัง bootstrap agent พร้อม platform identities ที่ฝังใน public key certificates บน RoT เพื่อให้ bootstrap agent เชื่อมต่อ ตรวจสอบสมาชิกภาพ และดึง K-1 shares จาก agent อื่นจนกู้คืน rack secret จาก K shares โดยไม่มี K shares ก็ไม่สามารถเรียนรู้ข้อมูลเกี่ยวกับ rack secret ได้ ส่วน shares ถูกเก็บแบบไม่เข้ารหัสบน M.2 drives ของแต่ละ sled ผู้โจมตีต้องขโมยอย่างน้อย K drives จึงกู้คืน rack secret ได้ และในอนาคต Oxide วางแผน seal secrets ด้วย RoT ให้ถอดรหัสเฉพาะตอน sled boot ซึ่งผู้โจมตีต้องขโมย K sled ทั้งตัวและ boot ได้จึงกู้คืน rack secret ได้ rack secret ใช้เป็น key-derivation source สำหรับสร้างหรือ wrap encryption keys ของ U.2 devices และสร้าง rack-level root certificates สำหรับ internal services

## ทำไมเรื่องนี้สำคัญ

บทความชี้ว่าคำถามเหล่านี้สำคัญต่อความปลอดภัยของ rack เพราะต้องระบุข้อมูลที่ถูกปกป้องด้วย rack secret, temporal lifecycle, spatial locality, ข้อจำกัดทางกายภาพหรือตรรกะที่กันการย้ายข้อมูลเข้ารหัส, key hierarchy, key schedule และกรณี key compromise ซึ่งช่วยกำหนดว่า attacker จะไม่สามารถขโมย sled หรือ drives บางส่วนแล้วกู้คืนข้อมูลที่มีประโยชน์ได้

## ผลกระทบที่น่าจับตา

- **สำหรับธุรกิจ:** ลดความเสี่ยงจากการขโมยฮาร์ดแวร์บางส่วน: ระบบกำหนดให้ต้องรวม K shares จากหลาย sled จึงกู้คืน rack secret ได้ ทำให้การขโมย sled หรือ M.2 drives บางส่วนไม่สามารถเปิดเผยข้อมูล storage at rest ได้

- **สำหรับนักพัฒนา:** กรอบ key hierarchy ที่ตรวจสอบได้: RFD ระบุคำถามที่ต้องตอบ เช่น ข้อมูลใดถูกปกป้อง, lifecycle, locality, key derivation/wrapping และ key compromise ซึ่งช่วยให้นักพัฒนาออกแบบและตรวจสอบระบบได้ตรงจุด

- **สำหรับผู้อ่าน:** แนวทางสำหรับ rack-level security: ใช้ RoT, certificates, sprockets sessions และ Shamir Secret Sharing เป็นตัวอย่างการออกแบบ trust quorum สำหรับระบบ rack

## มุมมองของทันเทค

บทวิเคราะห์: แนวคิดนี้ย้ายจุดอ่อนจากกุญแจเดียวบนอุปกรณ์เดียว ไปเป็น quorum ที่ต้องรวมหลาย sled ในแร็คเดียวกัน จึงเหมาะกับ data center ที่ต้องสมมติว่าผู้โจมตีเข้าถึงกายภาพได้บางส่วน แต่ RFD ยังเป็นเอกสารระบุคำถามและกรอบการออกแบบ ไม่ใช่การยืนยันว่าทุกกรณี key compromise ถูกจัดการครบแล้ว

## สรุปในประโยคเดียว

> Oxide เผย RFD 0301 ที่ใช้ Shamir Secret Sharing แบ่ง rack secret เป็น N shares และต้องรวม K shares จากหลาย sled จึงกู้คืนได้ เพื่อป้องกันผู้โจมตีขโมย sled หรือไดรฟ์บางส่วนแล้วเข้าถึงข้อมูล

## แหล่งข่าว

[อ่านต้นฉบับ](https://rfd.shared.oxide.computer/rfd/0301)
