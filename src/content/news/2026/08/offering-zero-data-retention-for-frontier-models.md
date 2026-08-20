---
title: "Offering Zero Data Retention for frontier models"
slug: "offering-zero-data-retention-for-frontier-models"
excerpt: "OpenAI reaffirms Zero Data Retention for eligible API customers and previews Private Safety Processing for advanced AI safety without compromising data privacy."
publishedAt: "2026-08-20T02:00:00.000+07:00"
sourcePublishedAt: "2026-08-19T19:00:00.000Z"
sourceName: "OpenAI Blog"
sourceUrl: "https://openai.com/index/offering-zero-data-retention-for-frontier-models"
author: "TanTech AI Desk"
categories:
  - AI
tags:
  - "AI"
  - "Zero Data Retention"
  - "API"
  - "OpenAI"
readingTimeMinutes: 3
featured: false
draft: false
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

## เกิดอะไรขึ้น

จากรายงานของ OpenAI Blog เกี่ยวกับ Zero Data Retention, API, OpenAI, Customer, Existing ZDR (1): Zero Data Retention gives eligible API customers a clear promise: OpenAI does not retain their prompts or model responses after a request is processed. Customer content is not available to OpenAI personnel for review1, and enterprise customer data is not used to train our models unless customers explicitly opt-in.As models take on longer, more complex tasks, some serious risks may only become visible across multiple interactions. Existing ZDR-compatible safety systems evaluate each interaction individually. Today, we’re previewing Private Safety Processing, which is designed to identify patterns across related interactions without giving OpenAI personnel access to the underlying content.For ZDR deployments, customer content remains on infrastructure the customer controls. We are also developing an option in which content is stored on OpenAI infrastructure, encrypted with keys controlled by the customer. In both cases, automated systems can identify potential misuse and return limited safety signals without exposing the underlying prompts or responses to OpenAI personnel.Why safety systems need to evolveThe most serious AI safety risks are not always visible in a single interaction. Often, potentially harmful intentions become clear only when multiple interactions are viewed together. Similar risks can arise when bad actors repeatedly probe safeguards, coordinate across accounts, or disguise threats as routine research. Risks can also develop over the course of an agentic task—for example, if a system becomes misaligned with the user’s intent by continuing to act after being told to stop.As AI systems take on longer and more complex tasks, this broader context becomes increasingly important for distinguishing legitimate activity from misuse and ensuring that AI agents remain within the bounds of their intended authority.Some recent frontier-model deployments have required customers to allow their AI provider to retain sensitive content for safety monitoring. For many organizations, such requirements conflict with their security obligations or commitments to the people they serve.Private Safety Processing is designed so we can continue to offer ZDR.How Private Safety Processing worksPrivate Safety Processing builds on the automated protections already used in ZDR and other deployments. Existing ZDR-compatible safety systems evaluate interactions individually. Private Safety Processing extends those protections across related interactions, allowing automated systems to identify patterns without OpenAI personnel having access to retained customer content.Private Safety Processing utilizes customer content regardless of where it is stored—whether in infrastructure customers control (ZDR deployments) or in storage provided by OpenAI. With OpenAI-provided storage, customer content is encrypted using keys controlled by the customer. OpenAI personnel do not have a copy of those keys, so they cannot access the underlying content.When a risk is identified, OpenAI receives a narrowly defined signal indicating the type of activity involved, similar to our existing safety systems today. That signal can be used to determine whether enforcement is necessary. OpenAI personnel do not receive access to the customer content even when it is flagged.Customers can investigate alerts and enforcement decisions using information available in their own systems. If they want to appeal, clarify legitimate activity, or support an investigation into verified abuse, they can choose to share relevant information with OpenAI.Private Safety Processing is currently being tested with early customers. We are sharing this preview now because we’ve heard our customers loud and clear that they need predictability about how their content will be protected as AI systems become more capable.Privacy and safety built with and for our customersOur mission is to ensure that artificial general intelligence benefits all of humanity. Collaboration with customers and partners is essential to how we build effective safeguards. As our principles make clear, no AI lab can address emerging risks alone. Private Safety Processing reflects that approach and is being shaped by customers across industries, regions, and company sizes.The organizations we work with handle some of the most sensitive information in their sectors, including financial records, health data, confidential business plans, and proprietary research. Protecting that information is essential to meeting regulatory obligations, maintaining customer trust, and preserving their competitive advantage.Their feedback is helping us build stronger safeguards while keeping their information under their control.“Enterprise AI adoption depends solely on customer control of data, with no direct or derivative use beyond the chosen service. OpenAI’s no-training commitment and ZDR give Glean confidence to build with OpenAI. As models become more capable, OpenAI shows safety can advance without compromising the privacy and control that sustain enterprise trust.”—Sunil Agrawal, Chief Information Security Officer, GleanWe will continue working with customers on the technical and operational details of our approach. We plan to start rolling out Private Safety Processing, and share a technical white paper, in September. We’ll keep customers informed every step of the way, sharing updates early, explaining what they mean for existing commitments, and providing the time and support customers need to plan ahead.

## ทำไมเรื่องนี้สำคัญ

ข่าวนี้เกี่ยวข้องกับ Zero Data Retention, API, OpenAI, Customer, Existing ZDR และ หมวดAI ซึ่งเป็นประเด็นที่กลุ่มผู้อ่านทันเทคติดตาม

## ผลกระทบที่น่าจับตา

### สำหรับผู้อ่าน

ผลกระทบต่อZero Data Retention, API, OpenAI, Customer, Existing ZDR: รายงานจาก OpenAI Blog เกี่ยวกับ Zero Data Retention, API, OpenAI, Customer, Existing ZDR อาจมีนัยสำคัญต่อการวางแผนและการตัดสินใจในวงการเทคโนโลยี

## มุมมองของทันเทค

บทวิเคราะห์: ข่าวจาก OpenAI Blog เกี่ยวกับ Zero Data Retention, API, OpenAI, Customer, Existing ZDR ที่มีรายละเอียดตัวเลข (1) ชี้ให้เห็นประเด็นที่ควรติดตามในหมวดAI โดยเฉพาะในบริบทของผู้อ่านทันเทคที่ต้องการเข้าใจแนวโน้มเทคโนโลยี

## สรุปในประโยคเดียว

> ความเคลื่อนไหวของ Zero Data Retention, API, OpenAI, Customer, Existing ZDR ในหมวดAI (1) จาก OpenAI Blog

## แหล่งข่าว

[อ่านต้นฉบับ](https://openai.com/index/offering-zero-data-retention-for-frontier-models)
