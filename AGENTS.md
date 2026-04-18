---
name: game-news-ai-system
description: Multi-agent system for collecting, processing, ranking, and delivering daily game news across 8 topics
license: MIT
compatibility: opencode
metadata:
  system: multi-agent-pipeline
  stack: nestjs-react-prisma
---

# System Overview

This project is a multi-agent pipeline that produces a **daily game news product**.

The system:

1. collects raw data from multiple sources
2. processes and summarizes content
3. selects one representative item per topic
4. generates card-news assets
5. builds and sends a daily email newsletter

The system must operate **fully automatically** with minimal manual intervention.

---

# Core Product Rules

- The system has exactly **8 topics**
- Each topic produces:
  - 2-3 curated items for the web app
  - 1 representative item for the newsletter
- The newsletter must include exactly **8 representative items**
- The pipeline must complete before newsletter send
- All stages must persist structured outputs
- Each stage must be independently retryable

---

# Topic Definitions

Stable topic keys:

- global_general
- fps_esports
- rpg
- aaa_console
- indie_dev
- mobile_asia
- game_dev_tech
- business

Do NOT rename or dynamically create topics.

---

# Pipeline Stages

The system is composed of **5 agents**, executed in order:

1. Collection Agent
2. Processing Agent
3. Topic Pick Agent
4. Card Asset Agent
5. Newsletter Agent

Each agent:

- takes structured input
- produces structured output
- must not depend on hidden state

---

# Critical Rule: JSON Contracts Only

All inter-agent communication MUST be JSON.

Agents MUST NOT:

- rely on plain text explanations
- infer missing data from context
- access previous agent memory implicitly

Each agent MUST:

- fully specify outputs
- include required fields
- include error reason if partial failure

---

# Data Flow Contract

Each stage consumes only previous stage outputs:

Collection → RawSourceItem  
Processing → ProcessedNewsItem  
Selection → DailyTopicPick  
Card → CardAsset  
Newsletter → NewsletterIssue

No stage may skip or bypass another stage.

---

# Idempotency Rules

Every job must be safe to re-run.

Re-running a job:

- must not duplicate rows
- must not send duplicate emails
- must not corrupt state

Use:

- unique keys
- upsert logic
- job status tracking

---

# Failure Handling Rules

Agents must NEVER silently fail.

On failure:

- return partial result if possible
- include explicit error message
- do not crash entire pipeline

The system must support:

- partial success
- selective retry

---

# Time & Scheduling Rules

- All operations must use a **single canonical timezone**
- "targetDate" must be consistent across all stages
- Newsletter send must be gated by completion checks

Newsletter must NOT send if:

- fewer than 8 topic picks exist
- processing is incomplete
- HTML generation failed

---

# Source Reliability Rules

Sources are unreliable.

Agents must:

- treat all external data as untrusted
- assign trust scores
- distinguish:
  - official
  - media
  - community
  - rumor

Rumors must NEVER be presented as confirmed facts.

---

# Content Integrity Rules

Agents must NOT:

- fabricate news
- merge unrelated events
- exaggerate claims
- remove uncertainty from rumors

Agents must:

- preserve original meaning
- reflect uncertainty when needed
- attribute sources

---

# Diversity Rules

The system must maintain topic diversity.

Do NOT:

- select multiple near-identical news items across topics
- allow one franchise/company to dominate all topics

---

# Scoring Guidelines

Each processed item should include:

- importanceScore
- interestScore
- trustScore

Selection must balance:

- relevance
- credibility
- audience appeal

---

# Card Asset Rules

Card assets must:

- be visually consistent
- not rely on copyrighted assets
- avoid direct character/logo replication
- reflect the core idea of the news

Fallback:

- text-only cards must be allowed

---

# Newsletter Rules

Newsletter must:

- contain exactly 8 items
- include unsubscribe link
- be HTML-safe
- be readable across email clients

Newsletter must NOT:

- send incomplete data
- send duplicate issues
- include broken assets

---

# Security Rules

- Subscriber emails must be treated as sensitive data
- Do NOT expose subscriber list publicly
- Do NOT log emails in plaintext logs
- Always support unsubscribe

---

# Development Rules

- Use strict TypeScript
- Keep modules small and composable
- Separate:
  - external adapters
  - core logic
- LLM prompts must be versioned
- Avoid large monolithic services

---

# Non-Goals

- Do not build a generic CMS
- Do not over-engineer early stages
- Do not depend on manual operations
- Do not tightly couple frontend and backend logic

---

# Success Criteria

Phase 1 is complete when:

- Topics are served via API
- News is grouped by topic
- Each topic has 2-3 items
- Subscription works
- Pipeline interfaces exist

---

# Final Rule

This system is a **data pipeline, not a chatbot**.

Agents must prioritize:

- correctness
- structure
- reproducibility

over:

- creativity
- verbosity


## Backend Agent Patch (Phase 1)

# Topic model

The system has exactly 8 top-level topics.
Do not hardcode display-only strings throughout the codebase.
Define topics in a central source of truth and reference them by stable keys.

Stable topic keys:
- global_general
- fps_esports
- rpg
- aaa_console
- indie_dev
- mobile_asia
- game_dev_tech
- business

The `business` topic covers business and market-moving developments in the game industry,
including earnings, acquisitions, layoffs, restructuring, platform policy, subscriptions,
pricing, regulation with commercial impact, and publisher strategy.

## Frontend Agent Patch (Phase 1)

# Product rules

- The home screen should make the 8 topics immediately understandable.
- Each topic tab should show today's curated items, not an unbounded feed.
- The UI should emphasize readability and speed over heavy interaction.
- Subscription must be easy and trustworthy.
- The frontend is not responsible for news generation logic.
- All ranking, summarization, and newsletter construction are backend responsibilities.

# Information architecture

Recommended topic keys:
- global_general
- fps_esports
- rpg
- aaa_console
- indie_dev
- mobile_asia
- game_dev_tech
- business
