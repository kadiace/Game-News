import { useMemo, useState } from 'react';
import { NewsList } from '../components/news/NewsList';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { LoadingState } from '../components/states/LoadingState';
import { SubscribeForm } from '../components/subscribers/SubscribeForm';
import { TopicTabs } from '../components/topics/TopicTabs';
import { useTodayNews } from '../hooks/useTodayNews';
import { useTopics } from '../hooks/useTopics';
import { getSampleNewsItems } from '../lib/sampleNews';
import { getOrderedTopics, NewsListItemDto, TopicFilterKey } from '../types/api';

export default function HomePage() {
  const { topics, loading, error } = useTopics();
  const { news, loading: newsLoading, error: newsError } = useTodayNews();
  const orderedTopics = useMemo(() => getOrderedTopics(topics), [topics]);
  const [activeTopicKey, setActiveTopicKey] = useState<TopicFilterKey>('all');
  const hasRequestError = Boolean(error || newsError);
  const isInitialLoading = loading || newsLoading;

  const allArticles = useMemo<NewsListItemDto[]>(() => {
    const topicMap = new Map((news?.topics ?? []).map((topic) => [topic.topicKey, topic]));

    return orderedTopics.flatMap((topic) => {
      const topicGroup = topicMap.get(topic.key);

      return (topicGroup?.items ?? []).map((item) => ({
        ...item,
        listKey: `${topic.key}:${item.id}`,
        topicKey: topic.key,
        topicDisplayName: topicGroup?.displayName ?? topic.displayName,
      }));
    });
  }, [news, orderedTopics]);

  const sampleArticles = useMemo(() => getSampleNewsItems(orderedTopics), [orderedTopics]);

  const displayArticles = allArticles.length > 0 ? allArticles : sampleArticles;

  const filteredArticles = useMemo(() => {
    if (activeTopicKey === 'all') {
      return displayArticles;
    }

    return displayArticles.filter((item) => item.topicKey === activeTopicKey);
  }, [activeTopicKey, displayArticles]);

  function handleTopicSelect(topicKey: TopicFilterKey) {
    setActiveTopicKey(topicKey);
  }

  return (
    <main style={{ display: 'grid', gap: 24 }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0, color: '#475467', fontSize: 14, fontWeight: 600 }}>Phase 1 · text-first daily briefing</p>
        <div>
          <h1 style={{ marginBottom: 8 }}>Today’s Game News</h1>
          <p style={{ margin: 0, color: '#475467', lineHeight: 1.6, maxWidth: 760 }}>
            Browse one article feed across all eight fixed topics. Tabs filter the list, and the article section is divided into date groups that expand automatically when you hover each date toggle.
          </p>
        </div>
        <div style={{ color: '#667085', fontSize: 14 }}>
          Coverage date: <strong>{news?.targetDate ?? 'Unavailable'}</strong>
        </div>
        {hasRequestError ? <ErrorState message={error ?? newsError ?? 'Unknown error'} /> : null}
        {allArticles.length === 0 ? (
          <p style={{ margin: 0, color: '#667085', fontSize: 14 }}>
            Showing sample articles until live content is available from the backend.
          </p>
        ) : null}
      </section>

      <section>
        <h2 style={{ marginBottom: 12 }}>Filter by topic</h2>
        <TopicTabs topics={orderedTopics} activeKey={activeTopicKey} onSelect={handleTopicSelect} includeAll />
      </section>

      <section style={{ display: 'grid', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 16, border: '1px solid #e5e7eb', background: '#ffffff' }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>
            {activeTopicKey === 'all'
              ? 'All topics'
              : orderedTopics.find((topic) => topic.key === activeTopicKey)?.displayName ?? 'Selected topic'}
          </h2>
          <p style={{ margin: 0, color: '#475467', lineHeight: 1.6 }}>
            {activeTopicKey === 'all'
              ? 'Viewing every curated item available for today across all eight topics.'
              : orderedTopics.find((topic) => topic.key === activeTopicKey)?.description ?? 'Viewing curated items for the selected topic.'}
          </p>
        </div>

        {isInitialLoading ? (
          <LoadingState message="Loading today’s curated article list…" />
        ) : (
          <NewsList
            items={filteredArticles}
            emptyMessage={
              activeTopicKey === 'all'
                ? 'No curated news items are available today.'
                : `No curated news items are available for ${orderedTopics.find((topic) => topic.key === activeTopicKey)?.displayName ?? 'this topic'} today.`
            }
          />
        )}
      </section>

      <section style={{ padding: 20, borderRadius: 16, border: '1px solid #e5e7eb', background: '#ffffff' }}>
        <h2 style={{ marginTop: 0 }}>Subscribe</h2>
        <p style={{ marginTop: 0, color: '#475467', lineHeight: 1.6, maxWidth: 680 }}>
          Get the daily issue when newsletter delivery is ready. For phase 1, this keeps the subscribe flow working while the product stays focused on text-first web delivery.
        </p>
        <SubscribeForm />
      </section>
    </main>
  );
}
