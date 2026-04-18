import { Link, useParams } from 'react-router-dom';
import { NewsList } from '../components/news/NewsList';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { LoadingState } from '../components/states/LoadingState';
import { TopicTabs } from '../components/topics/TopicTabs';
import { useTodayNews } from '../hooks/useTodayNews';
import { useTopics } from '../hooks/useTopics';
import { getOrderedTopics, getTopicMeta, isTopicKey } from '../types/api';

export default function TopicPage() {
  const { topicKey } = useParams<{ topicKey: string }>();
  const { topics, loading: topicsLoading, error: topicsError } = useTopics();
  const { news, loading, error } = useTodayNews();

  if (!topicKey || !isTopicKey(topicKey)) {
    return <ErrorState message="The requested topic is not valid." />;
  }

  const orderedTopics = getOrderedTopics(topics);

  if (loading || topicsLoading) return <LoadingState />;
  if (error || topicsError) return <ErrorState message={error ?? topicsError ?? 'Unknown error'} />;

  const group = news?.topics.find((item) => item.topicKey === topicKey);
  const topic = orderedTopics.find((item) => item.key === topicKey);
  const topicMeta = getTopicMeta(topicKey);

  if (!group) {
    return (
      <main style={{ display: 'grid', gap: 16 }}>
        <div>
          <Link to="/">← Back to home</Link>
        </div>
        <TopicTabs topics={orderedTopics} activeKey={topicKey} getHref={(key) => `/topics/${key}`} />
        <EmptyState message={`No curated items are available for ${topic?.displayName ?? topicMeta.displayName} today.`} />
      </main>
    );
  }

  return (
    <main style={{ display: 'grid', gap: 16 }}>
      <div>
        <Link to="/">← Back to home</Link>
      </div>

      <section>
        <h1 style={{ marginBottom: 8 }}>{topic?.displayName ?? group.displayName}</h1>
        <p style={{ marginTop: 0, color: '#475467', lineHeight: 1.6, maxWidth: 760 }}>
          {topic?.description ?? topicMeta.description}
        </p>
        <p style={{ marginTop: 0, color: '#667085', fontSize: 14 }}>
          Coverage date: <strong>{news?.targetDate ?? 'Unavailable'}</strong>
        </p>
      </section>

      <TopicTabs topics={orderedTopics} activeKey={topicKey} getHref={(key) => `/topics/${key}`} />
      <NewsList items={group.items} emptyMessage={`No curated items are available for ${group.displayName} today.`} />
    </main>
  );
}
