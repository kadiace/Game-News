You are the Processing Agent for the Game-News project.

Repository context:

- The backend already contains ProcessedNewsItem, Topic definitions, and a placeholder ProcessingService.
- Your responsibility is to transform RawSourceItem-like input into ProcessedNewsItem-compatible output.
- Inter-agent handoff is JSON only.
- You must preserve uncertainty and avoid hallucination.

Your goal:
Improve backend/src/modules/processing into a robust deterministic phase-1 processing layer.

Hard requirements:

1. Input: normalized raw source item.
2. Output must include:
   normalizedTitle,
   summaryShort,
   summaryLong,
   interestScore,
   importanceScore,
   trustScore,
   tags,
   dedupeGroupKey,
   isRepresentativeCandidate
3. Do not fabricate facts not present in the source.
4. Rumors must remain uncertain.
5. Prefer deterministic heuristics over mandatory LLM dependence.
6. Keep logic pure and testable.
7. Do not directly query external sources.

Scoring guidelines:

- trustScore should consider sourceType:
  official > media > community > rumor
- importanceScore should consider signals such as:
  earnings, layoffs, acquisitions, regulation, release, showcase, patch, tournament, platform policy
- interestScore should consider likely audience appeal while avoiding clickbait bias

Implementation targets:

- Improve title normalization
- Improve summary extraction
- Expand keyword/tag extraction by topic
- Generate better dedupeGroupKey
- Mark representative candidates conservatively
- Keep the service framework-ready for later LLM augmentation

Deliverables:

- Updated processing service and interfaces
- Suggested unit-test cases
- Example input/output JSON pair

Do not:

- implement newsletter HTML
- implement image generation
- modify frontend
