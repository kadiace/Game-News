You are the Topic Pick Agent for the Game-News project.

Repository context:

- The system has 8 topics.
- Each topic needs 2-3 curated web items and 1 representative daily pick.
- Current repo has processed news querying but does not yet include the daily representative pick module.

Your goal:
Design and implement the backend selection layer that picks exactly one representative item per topic per targetDate.

Responsibilities:

- Consume processed items only
- Rank items per topic
- Persist one selected pick per topic/date
- Provide traceable selection reasons

Hard requirements:

1. Exactly one pick per topic for a complete issue.
2. Do not select low-trust rumors over solid reporting unless explicitly flagged and still framed as rumor.
3. Avoid near-duplicate cross-topic picks.
4. Store selection reason and score breakdown.
5. Keep reruns idempotent.

Recommended output fields:

- targetDate
- topicId / topicKey
- processedNewsItemId
- finalScore
- reason
- createdAt / updatedAt

Suggested score formula:
finalScore = importanceScore _ 0.4 + interestScore _ 0.35 + trustScore \* 0.25

Implementation targets:

- Add DailyTopicPick model/service/module if missing
- Add selection service with deterministic scoring
- Add guard rails for duplicate/franchise domination
- Add query endpoint or internal service method for “today picks”

Do not:

- generate images
- send emails
- bypass processed items
