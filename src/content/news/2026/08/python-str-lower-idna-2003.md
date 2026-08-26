---
title: "Python พบช่องโหว่จาก str.lower() ในระบบ IDNA 2003"
slug: "python-str-lower-idna-2003"
excerpt: "Python พบช่องโหว่ CVE-2026-17084 จาก str.lower() ที่ใช้ข้อมูล Unicode เวอร์ชันใหม่ ทำให้การแปลง IDNA 2003 ไม่ตรงตาม RFC 3454"
publishedAt: "2026-08-26T12:38:48.072+07:00"
sourcePublishedAt: "2026-08-25T20:49:03.000Z"
sourceName: "Hacker News"
sourceUrl: "https://sethmlarson.dev/when-str-lower-is-a-security-vulnerability"
imageUrl: "https://github.com/sethmlarson.png"
author: "TanTech AI Desk"
categories:
  - Cybersecurity
  - Programming
tags:
  - "Python"
  - "CVE-2026-17084"
  - "IDNA"
  - "StringPrep"
  - "Unicode"
  - "RFC 3454"
  - "Python Software Foundation"
  - "Alpha-Omega"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

Python พบช่องโหว่ CVE-2026-17084 ในส่วนที่ str.lower() ใช้ข้อมูล Unicode เวอร์ชันที่มากับตัวแปลภาษา Python เช่น 17.0.0 แทน Unicode 3.2.0 ที่ StringPrep และ IDNA 2003 กำหนด ทำให้ str.encode('idna') ให้ค่าไม่ตรงตาม RFC 3454 เช่น 'ᎠᎠ' ให้ 'xn--kz9aa' แทน 'xn--58da' ทีมงานแก้ไขโดยเพิ่มข้อยกเว้นให้ str.lower() ทำงานตาม Unicode 3.2.0 เฉพาะฟังก์ชันที่เกี่ยวข้อง

## ทำไมเรื่องนี้สำคัญ

สำคัญเพราะ IDNA 2003 ยังถูกใช้ผ่าน idna codec ใน Python และ StringPrep ต้องใช้ Unicode 3.2.0 เพื่อให้การเปรียบเทียบชื่อโดเมนแบบไม่แยกตัวพิมพ์ใหญ่-เล็กทำงานสม่ำเสมอ การที่ str.lower() ใช้ Unicode 17.0.0 ทำให้ค่าที่แปลงได้ไม่ตรงตามสเปกและกระทบระบบที่พึ่งพาการตรวจสอบโดเมน

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** อัปเดต Python และตรวจสอบการแปลงโดเมน: ผู้พัฒนาที่ใช้ str.encode('idna') หรือ stringprep ต้องอัปเดต Python หลังแก้ไข CVE-2026-17084 และตรวจสอบว่าค่า IDNA 2003 ตรงกับ RFC 3454 โดยเฉพาะ Unicode 3.2.0

- **สำหรับธุรกิจ:** ระบบตรวจสอบชื่อโดเมนต้องทบทวน: ธุรกิจที่ใช้ Python แปลงหรือเปรียบเทียบชื่อโดเมนผ่าน IDNA 2003 ได้รับค่าไม่ตรงตามสเปกก่อนการแก้ไข ทำให้ต้องทบทวนโค้ดและข้อมูลโดเมนที่เคยประมวลผล

- **สำหรับผู้อ่าน:** มาตรฐาน Python สอดคล้องกับ RFC 3454: Python Software Foundation แก้ไขด้วยการเพิ่มข้อยกเว้นให้ str.lower() ทำงานตาม Unicode 3.2.0 เฉพาะฟังก์ชันที่เกี่ยวข้อง เพื่อให้ IDNA 2003 สอดคล้องกับ RFC 3454

## มุมมองของทันเทค

บทวิเคราะห์: ช่องโหว่นี้ไม่ใช่แค่บั๊กการแปลงตัวอักษร แต่เป็นตัวอย่างที่ชัดเจนว่ามาตรฐาน Unicode ที่เปลี่ยนตามเวอร์ชันสามารถสร้างช่องว่างระหว่างสเปกกับโค้ดได้ แม้ str.lower() จะดูเป็นฟังก์ชันพื้นฐาน แต่เมื่อถูกใช้กับ StringPrep ที่ผูกกับ Unicode 3.2.0 การพึ่งพาข้อมูล Unicode เวอร์ชันใหม่ทำให้ผลลัพธ์ IDNA 2003 ผิดเพี้ยนได้ ทีมพัฒนาควรใช้ idna package สำหรับ IDNA 2008 เมื่อไม่จำเป็นต้องใช้พฤติกรรมเก่า และระบบที่พึ่งพา IDNA 2003 ต้องอัปเดต Python พร้อมตรวจสอบค่าโดเมนที่เคยแปลง

## สรุปในประโยคเดียว

> Python แก้ช่องโหว่ CVE-2026-17084 ที่ str.lower() ใช้ Unicode เวอร์ชันใหม่ ทำให้ IDNA 2003 ไม่ตรงตาม RFC 3454

## แหล่งข่าว

[อ่านต้นฉบับ](https://sethmlarson.dev/when-str-lower-is-a-security-vulnerability)
