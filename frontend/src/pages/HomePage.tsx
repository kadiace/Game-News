import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsList } from '../components/news/NewsList';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { LoadingState } from '../components/states/LoadingState';
import { SubscribeForm } from '../components/subscribers/SubscribeForm';
import { TopicTabs } from '../components/topics/TopicTabs';
import { useTodayNews } from '../hooks/useTodayNews';
import { useTopics } from '../hooks/useTopics';
import { getOrderedTopics, TopicKey } from '../types/api';

export default function HomePage() {
  const { topics, loading, error } = useTopics();
  const { news, loading: newsLoading, error: newsError } = useTodayNews();
  const orderedTopics = useMemo(() => getOrderedTopics(topics), [topics]);
  const [activeTopicKey, setActiveTopicKey] = useState<TopicKey>(orderedTopics[0]?.key ?? 'global_general');

  const newsByTopic = useMemo(() => {
    return new Map((news?.topics ?? []).map((topic) => [topic.topicKey, topic]));
  }, [news]);

  function handleTopicSelect(topicKey: TopicKey) {
    setActiveTopicKey(topicKey);

    const section = document.getElementById(`topic-${topicKey}`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading || newsLoading) return <LoadingState />;
  if (error || newsError) return <ErrorState message={error ?? newsError ?? 'Unknown error'} />;
  if (orderedTopics.length === 0) return <EmptyState message="No active topics are available." />;

  return (
    <main style={{ display: 'grid', gap: 24 }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0, color: '#475467', fontSize: 14, fontWeight: 600 }}>Phase 1 · text-first daily briefing</p>
        <div>
          <h1 style={{ marginBottom: 8 }}>Today’s Game News</h1>
          <p style={{ margin: 0, color: '#475467', lineHeight: 1.6, maxWidth: 760 }}>
            Browse all eight fixed topics, each with up to three curated items from the backend. The client only renders today’s grouped results and does not re-rank or reshape them.
          </p>
        </div>
        <div style={{ color: '#667085', fontSize: 14 }}>
          Coverage date: <strong>{news?.targetDate ?? 'Unavailable'}</strong>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 12 }}>Jump to a topic</h2>
        <TopicTabs topics={orderedTopics} activeKey={activeTopicKey} onSelect={handleTopicSelect} />
      </section>

      <section style={{ display: 'grid', gap: 20 }}>
        {orderedTopics.map((topic) => {
          const group = newsByTopic.get(topic.key);
          const isActive = topic.key === activeTopicKey;

          return (
            <article
              key={topic.key}
              id={`topic-${topic.key}`}
              style={{
                padding: 20,
                borderRadius: 16,
                border: isActive ? '1px solid #111827' : '1px solid #e5e7eb',
                background: '#ffffff',
                boxShadow: isActive ? '0 8px 24px rgba(15, 23, 42, 0.08)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ marginTop: 0, marginBottom: 8 }}>{topic.displayName}</h2>
                  <p style={{ margin: 0, color: '#475467', lineHeight: 1.6, maxWidth: 720 }}>{topic.description}</p>
                </div>
                <Link to={`/topics/${topic.key}`}>Open topic page</Link>
              </div>

              <NewsList
                items={group?.items ?? []}
                emptyMessage={`No curated items are available for ${topic.displayName} today.`}
              />
            </article>
          );
        })}
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
