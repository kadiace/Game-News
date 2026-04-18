import { useParams } from 'react-router-dom';
import { NewsList } from '../components/news/NewsList';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { LoadingState } from '../components/states/LoadingState';
import { useTodayNews } from '../hooks/useTodayNews';

export default function TopicPage() {
  const { topicKey } = useParams<{ topicKey: string }>();
  const { news, loading, error } = useTodayNews();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const group = news?.topics.find((item) => item.topicKey === topicKey);

  if (!group) {
    return <EmptyState message="Topic not found or no curated items for today." />;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>{group.displayName}</h1>
      <NewsList items={group.items} />
    </main>
  );
}
