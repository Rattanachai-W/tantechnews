---
title: "Vercel เปิดตัว Virtual Models บน AI Gateway ช่วยเปลี่ยนโมเดล AI ได้ทันทีโดยไม่ต้องแก้โค้ด"
slug: "vercel-virtual-models-ai-gateway-ai"
excerpt: "Vercel เพิ่มฟีเจอร์ Virtual Models ใน AI Gateway สร้างเลเยอร์นามธรรมให้การเรียกใช้ AI เปลี่ยนโมเดลหรือตั้งค่า Fallback ได้จากส่วนกลาง โดยไม่ต้อง Deploy แอปพลิเคชันใหม่"
publishedAt: "2026-10-28T12:00:00.000+07:00"
sourcePublishedAt: "2026-10-28T07:25:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/blog/ai-gateway-virtual-models"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/mtIa9LU2YDNu96qNaMC6n/2cc778b79c0f8b6df64e634989743fed/Models_on__AI_Gateway__7_.png"

author: "TanTech AI Desk"
categories:
  - AI
  - Cloud
  - Programming
tags:
  - "Vercel"
  - "AI Gateway"
  - "Virtual Models"
  - "LLM"
  - "Developer Tools"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Vercel เปิดตัว Virtual Models บน AI Gateway ซึ่งทำหน้าที่เป็นตัวแทน (Abstraction) ของ Model String และการตั้งค่าต่างๆ โดยนักพัฒนาสามารถสร้าง Virtual Model ID สำหรับแต่ละงาน (เช่น vmc/coding-agent) และกำหนดโมเดลรวมถึงการตั้งค่า เช่น Zero Data Retention ไว้ที่ส่วนกลาง เมื่อต้องการเปลี่ยนโมเดลหรืออัปเดตการตั้งค่า สามารถทำได้ผ่าน AI Gateway ซึ่งจะมีผลกับทุกแอปพลิเคชันและ Agent ที่เรียกใช้ ID นั้นโดยอัตโนมัติภายในไม่กี่นาที โดยไม่ต้องแก้ไขโค้ดหรือทำการ Redeploy

## ทำไมเรื่องนี้สำคัญ

ช่วยลดความยุ่งยากในการจัดการโมเดล AI ที่มีการอัปเดตบ่อยครั้ง (เฉลี่ย 10 โมเดลต่อสัปดาห์ใน AI Gateway) และช่วยให้ทีม Security หรือ Platform สามารถควบคุมการใช้งานโมเดลและการตั้งค่าความเป็นส่วนตัวของข้อมูลได้จากจุดเดียว แทนที่จะต้องไล่แก้ไขในระดับ Source Code ของทุกโปรเจกต์

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** ลด Cycle การ Deploy และเพิ่มความยืดหยุ่น: สามารถทดสอบโมเดลใหม่ผ่าน Candidate ID และสลับกลับไปยังโมเดลเดิมได้ทันทีหากผลลัพธ์ไม่เป็นไปตามที่คาด โดยไม่ต้องผ่านกระบวนการ CI/CD

- **สำหรับธุรกิจ:** การบริหารจัดการต้นทุนและประสิทธิภาพตามรายกิจกรรม: สามารถเลือกใช้โมเดลราคาถูกสำหรับงานที่ทำซ้ำจำนวนมาก และใช้โมเดลประสิทธิภาพสูงสำหรับงานที่ซับซ้อน โดยแยกการจัดการผ่าน Virtual Model ตามวัตถุประสงค์ของงาน

## มุมมองของทันเทค

บทวิเคราะห์: การนำแนวคิด Abstraction มาใช้กับ Model ID ช่วยแก้ปัญหา Vendor Lock-in ในระดับ Implementation ได้อย่างมีประสิทธิภาพ เนื่องจากนักพัฒนาไม่ต้องผูกติดกับชื่อโมเดลของ Provider รายใดรายหนึ่งในโค้ด อย่างไรก็ตาม ผู้ใช้งานจำเป็นต้องตรวจสอบ Provider Options ทุกครั้งที่มีการสลับค่ายโมเดล เนื่องจากค่าคอนฟิกเฉพาะของแต่ละเจ้า (เช่น Anthropic vs OpenAI) จะไม่ถูกส่งต่อตามไปด้วย สิ่งที่ผู้ใช้ควรทำต่อคือการวางระบบ Evaluation Pipeline เพื่อทดสอบโมเดลใน Candidate ID ก่อนสลับใช้งานจริงใน Production เพื่อป้องกันคุณภาพของคำตอบลดลง

## สรุปในประโยคเดียว

> Vercel เปิดตัว Virtual Models บน AI Gateway ให้ผู้ใช้จัดการและสลับโมเดล AI รวมถึงการตั้งค่าความปลอดภัยได้จากส่วนกลางโดยไม่ต้องแก้ไขโค้ดหรือ Deploy แอปใหม่

## แหล่งข่าว

[อ่านรายงานจาก Vercel Blog](https://vercel.com/blog/ai-gateway-virtual-models)
