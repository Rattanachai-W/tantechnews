---
title: "NX bit ไม่ใช่แค่เรื่องความปลอดภัย: ไล่บั๊ก ARM64 ใน hypervisor แบบ bare-metal"
slug: "nx-bit-arm64-hypervisor-bare-metal"
excerpt: "บทความเล่าการดีบักบั๊กใน hypervisor แบบ bare-metal บน ARM64 สำหรับ postmarketOS ที่เปิด CTR_EL0 intercept แล้วเครื่องค้างแบบสุ่ม จนพบสาเหตุหนึ่งคือการจัดเรียงอาร์เรย์คำสั่งที่รันขณะ runtime บน ARM ที่ไม่ Icache/Dcache coherent"
publishedAt: "2026-09-05T02:23:47.557+07:00"
sourcePublishedAt: "2026-09-04T06:27:04.000Z"
sourceName: "Lobsters"
sourceUrl: "https://purplesyringa.moe/blog/guest/the-nx-bit-is-not-just-about-security/"
imageUrl: "https://purplesyringa.moe/blog/guest/the-nx-bit-is-not-just-about-security/og.png"
author: "TanTech AI Desk"
categories:
  - Programming
  - Hardware
  - Cybersecurity
tags:
  - "NX bit"
  - "ARM"
  - "ARM64"
  - "Aarch64"
  - "hypervisor"
  - "postmarketOS"
  - "QEMU"
  - "Icache/Dcache coherent"
  - "bare-metal"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Sonya พัฒนา bare-metal hypervisor บน ARM64 สำหรับ postmarketOS เมื่อเปิด CTR_EL0 intercept โทรศัพท์ค้างแบบสุ่มและ watchdog รีเซ็ตระบบ เธอตรวจสอบ exception handler trampoline, stack allocation และ singlestep ใน QEMU พบว่า handler ทำงานถูกต้องบนฮาร์ดแวร์จริง สาเหตุหนึ่งคือ msr_accessor_sort จัดเรียงอาร์เรย์ที่เก็บคำสั่ง machine instructions ขณะ runtime บน ARM ที่ไม่ Icache/Dcache coherent ทำให้คำสั่งที่แก้ไขไม่ถูก fetch อย่างถูกต้อง เธอจึงย้ายการ sort ไปที่ build phase ซึ่ง handler ทำงานได้ แต่ระบบยังบูตไม่สำเร็จ จากนั้นเธอตั้งสมมติฐานว่าฮาร์ดแวร์ทำงานนอกสเปก

## ทำไมเรื่องนี้สำคัญ

ประเด็นสำคัญคือบั๊กนี้ไม่ได้เกิดจากตรรกะ exception handler ธรรมดา แต่เกิดจากพฤติกรรม cache ของ ARM ที่ไม่ Icache/Dcache coherent และการที่ ARM มีผู้ผลิตหลายรายซึ่งปรับแต่ง implementation ได้เอง ต่างจาก x86(-64) ที่มี Intel และ AMD เป็นหลัก ทำให้การดีบัก hypervisor บน ARM64 ต้องพิจารณาทั้ง QEMU, ฮาร์ดแวร์จริง, และพฤติกรรมเฉพาะของ CPU

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** นักพัฒนา low-level และ hypervisor: ต้องระวังการแก้ไขโค้ดหรือตารางคำสั่งขณะ runtime บน ARM เพราะ Icache/Dcache ไม่ coherent และต้องทดสอบทั้ง QEMU กับฮาร์ดแวร์จริง

- **สำหรับธุรกิจ:** ผู้ผลิตอุปกรณ์และทีมระบบปฏิบัติการ: ความแตกต่างของ ARM implementation ระหว่างผู้ผลิตทำให้การดีบักต้องพิจารณาพฤติกรรมเฉพาะของ CPU จากชิปแต่ละรุ่น

## มุมมองของทันเทค

บทวิเคราะห์: กรณีนี้ชี้ว่าบั๊กระดับต่ำใน ARM64 อาจซ่อนอยู่ในรายละเอียดที่ QEMU ไม่สามารถจำลองได้ครบ เช่น cache coherency และพฤติกรรมเฉพาะของฮาร์ดแวร์ การดีบัก hypervisor บน ARM จึงต้องอาศัยการแยกชั้นปัญหาอย่างชัดเจน ตั้งแต่ exception handler, stack, instruction fetch, ไปจนถึงความแตกต่างระหว่างผู้ผลิตชิป

## สรุปในประโยคเดียว

> บทความเล่าการไล่บั๊ก bare-metal hypervisor บน ARM64 สำหรับ postmarketOS ที่เปิด CTR_EL0 intercept แล้วเครื่องค้าง จนพบปัญหา cache coherency และการ sort อาร์เรย์คำสั่งขณะ runtime

## แหล่งข่าว

[อ่านต้นฉบับ](https://purplesyringa.moe/blog/guest/the-nx-bit-is-not-just-about-security/)
