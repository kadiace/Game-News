import { useMemo, useState } from 'react';
import { NewsList } from '../components/news/NewsList';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { LoadingState } from '../components/states/LoadingState';
import { SubscribeForm } from '../components/subscribers/SubscribeForm';
import { TopicTabs } from '../components/topics/TopicTabs';
import { useTodayNews } from '../hooks/useTodayNews';
import { useTopics } from '../hooks/useTopics';

export default function HomePage() {
  const { topics, loading, error } = useTopics();
  const { news, loading: newsLoading, error: newsError } = useTodayNews();
  const [activeTopicKey, setActiveTopicKey] = useState<string>('');

  const defaultTopicKey = useMemo(() => topics?.[0]?.key ?? '', [topics]);
  const selectedTopicKey = activeTopicKey || defaultTopicKey;

  const selectedGroup = news?.topics.find((topic) => topic.topicKey === selectedTopicKey);

  if (loading || newsLoading) return <LoadingState />;
  if (error || newsError) return <ErrorState message={error ?? newsError ?? 'Unknown error'} />;
  if (!topics || topics.length === 0) return <EmptyState message="No active topics are available." />;

  return (
    <main style={{ padding: 24 }}>
      <h1>Game News</h1>
      <TopicTabs topics={topics} activeKey={selectedTopicKey} onSelect={setActiveTopicKey} />
      <NewsList items={selectedGroup?.items ?? []} />

      <section style={{ marginTop: 32 }}>
        <h2>Subscribe</h2>
        <SubscribeForm />
      </section>
    </main>
  );
}
