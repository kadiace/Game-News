import { Link, useParams } from 'react-router-dom';
import { NewsList } from '../components/news/NewsList';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { LoadingState } from '../components/states/LoadingState';
import { TopicTabs } from '../components/topics/TopicTabs';
import { useTodayNews } from '../hooks/useTodayNews';
import { useTopics } from '../hooks/useTopics';
import { getSampleNewsItems } from '../lib/sampleNews';
import { getOrderedTopics, getTopicMeta, isTopicKey, NewsListItemDto } from '../types/api';

export default function TopicPage() {
  const { topicKey } = useParams<{ topicKey: string }>();
  const { topics, loading: topicsLoading, error: topicsError } = useTopics();
  const { news, loading, error } = useTodayNews();

  if (!topicKey || !isTopicKey(topicKey)) {
    return <ErrorState message="The requested topic is not valid." />;
  }

  const orderedTopics = getOrderedTopics(topics);
  const hasRequestError = Boolean(error || topicsError);
  const isInitialLoading = loading || topicsLoading;

  const group = news?.topics.find((item) => item.topicKey === topicKey);
  const topic = orderedTopics.find((item) => item.key === topicKey);
  const topicMeta = getTopicMeta(topicKey);
  const liveGroupItems: NewsListItemDto[] = (group?.items ?? []).map((item) => ({
    ...item,
    listKey: `${topicKey}:${item.id}`,
    topicKey,
    topicDisplayName: group?.displayName ?? topic?.displayName ?? topicMeta.displayName,
  }));
  const sampleItems = getSampleNewsItems(orderedTopics).filter((item) => item.topicKey === topicKey);
  const groupItems = liveGroupItems.length > 0 ? liveGroupItems : sampleItems;

  if (isInitialLoading) {
    return (
      <main style={{ display: 'grid', gap: 16 }}>
        <div>
          <Link to="/">← Back to home</Link>
        </div>

        <section>
          <h1 style={{ marginBottom: 8 }}>{topic?.displayName ?? topicMeta.displayName}</h1>
          <p style={{ marginTop: 0, color: '#475467', lineHeight: 1.6, maxWidth: 760 }}>
            {topic?.description ?? topicMeta.description}
          </p>
          <p style={{ marginTop: 0, color: '#667085', fontSize: 14 }}>
            Coverage date: <strong>{news?.targetDate ?? 'Unavailable'}</strong>
          </p>
        </section>

        <TopicTabs topics={orderedTopics} activeKey={topicKey} getHref={(key) => `/topics/${key}`} />
        <LoadingState message={`Loading curated items for ${topic?.displayName ?? topicMeta.displayName}…`} />
      </main>
    );
  }

  if (hasRequestError) {
    return (
      <main style={{ display: 'grid', gap: 16 }}>
        <div>
          <Link to="/">← Back to home</Link>
        </div>

        <section>
          <h1 style={{ marginBottom: 8 }}>{topic?.displayName ?? topicMeta.displayName}</h1>
          <p style={{ marginTop: 0, color: '#475467', lineHeight: 1.6, maxWidth: 760 }}>
            {topic?.description ?? topicMeta.description}
          </p>
          <p style={{ marginTop: 0, color: '#667085', fontSize: 14 }}>
            Coverage date: <strong>{news?.targetDate ?? 'Unavailable'}</strong>
          </p>
        </section>

        <TopicTabs topics={orderedTopics} activeKey={topicKey} getHref={(key) => `/topics/${key}`} />
        <ErrorState message={error ?? topicsError ?? 'Unknown error'} />
        <NewsList items={groupItems} emptyMessage={`Unable to load ${topic?.displayName ?? topicMeta.displayName} right now.`} />
      </main>
    );
  }

  if (!group) {
    return (
      <main style={{ display: 'grid', gap: 16 }}>
        <div>
          <Link to="/">← Back to home</Link>
        </div>
        <TopicTabs topics={orderedTopics} activeKey={topicKey} getHref={(key) => `/topics/${key}`} />
        <NewsList items={groupItems} emptyMessage={`No curated items are available for ${topic?.displayName ?? topicMeta.displayName} today.`} />
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
      <NewsList items={groupItems} emptyMessage={`No curated items are available for ${group.displayName} today.`} />
    </main>
  );
}
