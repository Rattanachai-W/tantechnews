---
title: "Introducing the Billable Usage API: programmatic cost visibility for Cloudflare"
slug: "introducing-the-billable-usage-api-programmatic-cost-visibil"
excerpt: "Cloudflare has launched a new Billable Usage API for accounts, giving developers and FinOps teams single-endpoint programmatic visibility into cost and usage across all self-serve products."
publishedAt: "2026-08-03T22:25:05.451+07:00"
sourcePublishedAt: "2026-08-03T13:00:00.000Z"
sourceName: "Cloudflare Blog"
sourceUrl: "https://blog.cloudflare.com/billable-usage-api/"
author: "TanTech AI Desk"
categories:
  - Programming
tags:
  - "Programming"
  - "Agents Week"
  - "Workers"
  - "That"
readingTimeMinutes: 4
featured: false
draft: true
aiGenerated: true
reviewedBy: null
---

## เกิดอะไรขึ้น

จากรายงานของ Cloudflare Blog เกี่ยวกับ Agents Week, Workers, That, Cloudflare, The (2, 1, 4, 2026, 02): Agents Week is about the shift already underway: agents write code, deploy Workers, and provision infrastructure on your behalf. That shift changes what you need to see. If a program is spending money in your Cloudflare account, you need to know what it's spending; throughout the day, per product, in a shape another program can consume. The dashboard is the right answer for humans. It's not the right answer for automation.So we're launching a new Billable Usage API for self-serve accounts: a single endpoint that returns your account's usage and cost, broken down by product and by service period. It covers every usage-based Cloudflare product on the account, including Workers, R2, D1, Workers AI, Vectorize, Images, and Stream, all with one call. And if you already work in a FinOps toolchain, the column names should look familiar.curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/billable-usage \ -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/billable-usage?from=2026-02-01&to=2026-02-15" \ -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"You'll get back an HTTP 200 OK with Content-Type: application/json and the usage rows in the response body. Today, usage and cost data are updated daily while we work towards providing more real time data. What comes backEach row in the response is one charge period for one product on your account.ServiceName and ServiceFamilyName — which product ("Workers Standard" under the "Workers" family, "R2 Storage" under "R2", etc.).ChargePeriodStart / ChargePeriodEnd — the window this row covers.PricingQuantity and ConsumedUnit — how much you used, in the unit of measure we bill on (GB-months, GB-seconds, requests, etc.).ContractedCost — what that period cost, in BillingCurrency.CumulatedPricingQuantity and CumulatedContractedCost — running totals for the billing period.ZoneId / ZoneName — when the usage is attributed to a specific zone.Most of these map directly to columns in the FinOps Open Cost and Usage Specification (FOCUS), so if your team is already ingesting FOCUS data from another provider, the names and semantics should be familiar:Cloudflare fieldFOCUS columnNotesBillingCurrencyBillingCurrencyExact match.BillingPeriodStartBillingPeriodStartExact match.ChargePeriodStart / ChargePeriodEndChargePeriodStart / ChargePeriodEndExact match.ServiceNameServiceNameExact match.ConsumedQuantity / ConsumedUnitConsumedQuantity / ConsumedUnitExact match.PricingQuantityPricingQuantityExact match.ContractedCostContractedCostExact match.ServiceFamilyName(close to ServiceCategory)Cloudflare-native grouping; FOCUS uses a controlled vocabulary.CumulatedContractedCost(derived)Convenience field — FOCUS treats cumulation as a query concern.ZoneId / ZoneName(close to ResourceId / ResourceName)Zone-scoped identifier where applicable.Responses use the standard Cloudflare API envelope — result is an array of rows, one per product per charge period, alongside success, errors, and messages.{ "result": [ { "BillingCurrency": "USD", "BillingPeriodStart": "2025-02-01T00:00:00Z", "ChargePeriodStart": "2025-02-01T00:00:00Z", "ChargePeriodEnd": "2025-02-28T23:59:59Z", "ServiceName": "Workers Standard", "ServiceFamilyName": "Workers", "ConsumedQuantity": 150000, "ConsumedUnit": "GB-months", "ContractedCost": 0.75, "CumulatedContractedCost": 2.25 } ], "success": true, "errors": [], "messages": [] }Where we are on FOCUSMatching FOCUS naming was a deliberate choice. AWS, Azure, Google Cloud, Oracle, and a growing list of SaaS providers already publish FOCUS formatted exports, and every serious cost-management tool speaks to it. That said, we're not yet claiming full conformance: a handful of columns the spec requires aren't in the payload today. Getting there is on our roadmap. Consider this the first step: familiar shape now, full conformance next.Cloudflare spend, next to the rest of your cloud spend: our partnership with VantageWe've partnered with Vantage on a native Cloudflare integration. Vantage is an infrastructure cost management platform that ingests cost and usage data from more than 30 providers, across AI, Cloud and SaaS providers, and brings it into a single view for reporting, allocation, and optimization. With this integration, your usage flows into the same Cost Reports, Budgets, and Cost Alerts you already use for the rest of your infrastructure.Vantage connects to Cloudflare using a read-only API token with Billing Read access. Once connected, Vantage pulls your Billable Usage data daily and breaks it down by product (such as Workers and R2), zone, and account, so you can see which products drive your spend and attribute it to the teams and services behind it.A few of the workflows this integration supports:Cross-provider allocation. Group Cloudflare spend by product, zone, and account, then use Virtual Tags to allocate by team or product line alongside your AWS, Azure, and other provider costs, all in a single report.Anomaly detection. Vantage Cost Alerts monitor every connected provider and notify you via Slack or E-Mail when spend deviates from its baseline, so a change in Workers or R2 spend surfaces the same way it does for any other provider.FinOps agents and MCP. Ask the in-console Vantage FinOps agent a question such as "What was our biggest cost driver last week across every provider?", or query the same data from Claude or ChatGPT through Vantage's hosted MCP server. Cloudflare spend is included alongside your other connected providers.Connect your Cloudflare account in the Vantage console, and your costs appear next to everything else you run. There are no manual exports, no invoice uploads, and no separate dashboard to maintain. This FOCUS standardized API also works with other Fintech tooling.Why we built thisAgents do more than write code. They deploy Workers, provision R2 buckets, and manage D1 databases. When you grant programmatic access to your Cloudflare account, you need programmatic visibility into what it's costing you. Not at the end of the month, but throughout the day, by product, in a shape a program can actually consume.The Billable Usage API is that shape. And customers have been asking us for programmatic usage for years. Finance teams want to pull spend into their own systems and attribute cost back to internal projects, teams, and even their end customers. Developers want a curl they can drop in a script. Every one of those workflows used to involve a screenshot or a manual export. Now it's an HTTP call, or a configuration in Vantage.What's nextFiner-grained time windows. Today the API returns charge-period rows, which for most products is daily. We're looking at more real time breakdowns for the products where it makes sense.Forecasting. CumulatedContractedCost tells you where your spend is in the current billing cycle. We want to help you predict where you're going to end up. And not just at the account level, but the product level.Enterprise coverage. This first release is self-serve only. An equivalent experience for Enterprise contracts is in the works.Try itThe endpoint is live today for all self-serve accounts. Grab an API token with the Billing Read permission, point your curl at it, and you'll get back your current billing period broken down by product. Full reference is available on the Cloudflare API docs. To see it alongside the rest of your cloud spend, connect your Cloudflare account in the Vantage console.Cloudflare has spent years making it easy to run more of your stack on our network. It's time we made it just as easy to see what that's costing you — on Cloudflare, and everywhere else.

## ทำไมเรื่องนี้สำคัญ

ข่าวนี้เกี่ยวข้องกับ Agents Week, Workers, That, Cloudflare, The และ หมวดProgramming ซึ่งเป็นประเด็นที่กลุ่มผู้อ่านทันเทคติดตาม

## ผลกระทบที่น่าจับตา

### สำหรับนักพัฒนา

ผลกระทบต่อAgents Week, Workers, That, Cloudflare, The: รายงานจาก Cloudflare Blog เกี่ยวกับ Agents Week, Workers, That, Cloudflare, The อาจมีนัยสำคัญต่อการวางแผนและการตัดสินใจในวงการเทคโนโลยี

## มุมมองของทันเทค

บทวิเคราะห์: ข่าวจาก Cloudflare Blog เกี่ยวกับ Agents Week, Workers, That, Cloudflare, The ที่มีรายละเอียดตัวเลข (2, 1, 4, 2026, 02) ชี้ให้เห็นประเด็นที่ควรติดตามในหมวดProgramming โดยเฉพาะในบริบทของผู้อ่านทันเทคที่ต้องการเข้าใจแนวโน้มเทคโนโลยี

## สรุปในประโยคเดียว

> ความเคลื่อนไหวของ Agents Week, Workers, That, Cloudflare, The ในหมวดProgramming (2, 1, 4, 2026, 02) จาก Cloudflare Blog

## แหล่งข่าว

[อ่านต้นฉบับ](https://blog.cloudflare.com/billable-usage-api/)
