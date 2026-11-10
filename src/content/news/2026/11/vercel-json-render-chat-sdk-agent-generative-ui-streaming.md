---
title: "Vercel เปิดตัว json-render ช่วยให้ Chat SDK Agent ส่ง Generative UI แบบ Streaming ได้หลากหลายแพลตฟอร์ม"
slug: "vercel-json-render-chat-sdk-agent-generative-ui-streaming"
excerpt: "Vercel เพิ่มความสามารถให้ Chat SDK Agent สามารถส่ง Generative UI ผ่าน json-render โดยแปลง JSON spec เป็นการ์ดที่รองรับรูปแบบ Native ของแต่ละแพลตฟอร์ม เช่น Slack และ Teams ได้ทันที"
publishedAt: "2026-11-07T12:00:00.000+07:00"
sourcePublishedAt: "2026-11-06T21:00:00.000Z"
sourceName: "Vercel Blog"
sourceUrl: "https://vercel.com/changelog/json-render-and-chat-sdk-agents"
imageUrl: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/7GBRL4iPtI99gtYPzGUJgT/89543d900cd8337eb22bb11c9712218c/image.png"

author: "TanTech AI Desk"
categories:
  - AI
  - Programming
  - Cloud
tags:
  - "Vercel"
  - "Chat SDK"
  - "json-render"
  - "Generative UI"
  - "Slack"
  - "Microsoft Teams"
readingTimeMinutes: 1
featured: false
draft: false
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

Vercel เปิดตัว json-render ซึ่งทำงานร่วมกับ Chat SDK โดยใช้ Typed catalog ของคอมโพเนนต์ (เช่น ตาราง, กราฟ, ปุ่ม) เพื่อให้ AI Agent เขียน JSON spec แล้วแปลงเป็น Chat SDK card จากนั้น Adapter จะนำไปแสดงผลในรูปแบบ Native ของแพลตฟอร์มปลายทาง เช่น Block Kit บน Slack หรือ Adaptive Cards บน Teams โดยรองรับการ Streaming ข้อมูลแบบ Real-time ซึ่งจะอัปเดตข้อความทุกๆ 500 มิลลิวินาที และมีระบบตรวจสอบความถูกต้องของ Spec ผ่าน CardSpecError รวมถึงการจัดการข้อจำกัดด้านเนื้อหาของแต่ละแพลตฟอร์ม

## ทำไมเรื่องนี้สำคัญ

ช่วยลดภาระของนักพัฒนาในการสร้างและดูแลเครื่องมือแยกสำหรับแต่ละรูปแบบข้อความในแต่ละแพลตฟอร์ม เนื่องจากใช้ Catalog ชุดเดียวในการควบคุมการแสดงผล และการรองรับ Streaming ทำให้ผู้ใช้เห็น UI ที่ค่อยๆ ปรากฏขึ้นตามการประมวลผลของ AI แทนการรอจนจบการทำงาน

## ผลกระทบที่น่าจับตา

- **สำหรับนักพัฒนา:** ลดความซับซ้อนในการพัฒนา Multi-platform Bot: ไม่ต้องเขียนโค้ดจัดการ UI แยกตามแพลตฟอร์ม แต่ใช้การกำหนด Schema ผ่าน json-render เพื่อให้ Adapter จัดการแปลงเป็น Native format เอง

- **สำหรับธุรกิจ:** ยกระดับประสบการณ์ผู้ใช้ในแอปพลิเคชันแชทองค์กร: สามารถนำเสนอข้อมูลซับซ้อน เช่น กราฟหรือตาราง ผ่าน AI Agent ใน Slack หรือ Teams ได้อย่างสวยงามและโต้ตอบได้รวดเร็วขึ้นด้วยระบบ Streaming

## มุมมองของทันเทค

บทวิเคราะห์: การนำ json-render มาใช้เป็นการแก้ปัญหา Fragmentation ของ UI ในแอปพลิเคชันแชทที่แต่ละค่ายมีมาตรฐานต่างกัน โดยการใช้ JSON เป็นตัวกลาง (Intermediate Representation) ทำให้ AI สามารถควบคุม UI ได้ยืดหยุ่นขึ้น นักพัฒนาควรตรวจสอบข้อจำกัด (Platform limits) ของแต่ละ Adapter เช่น กรณี Slack ที่จะแปลงตารางที่สองเป็น code block เพื่อให้สามารถออกแบบ Prompt ให้ AI สร้าง Spec ที่ไม่เกินขีดจำกัดของแพลตฟอร์มนั้นๆ ทั้งนี้ ข้อมูลในบทความยังไม่ได้ระบุถึงประสิทธิภาพการใช้ Token ที่เพิ่มขึ้นจากการที่ AI ต้องเขียน JSON spec แทนข้อความปกติ ซึ่งเป็นจุดที่ผู้ใช้งานจริงต้องทดสอบ

## สรุปในประโยคเดียว

> Vercel เปิดตัว json-render ให้ AI Agent สามารถสร้างและส่ง Generative UI แบบ Streaming ที่ปรับเปลี่ยนตามรูปแบบ Native ของ Slack และ Teams ได้อัตโนมัติ

## แหล่งข่าว

[อ่านรายงานจาก Vercel Blog](https://vercel.com/changelog/json-render-and-chat-sdk-agents)
