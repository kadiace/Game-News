import { useEffect, useState } from 'react';
import { fetchTopics } from '../lib/api';
import { TopicDto } from '../types/api';

export function useTopics() {
  const [topics, setTopics] = useState<TopicDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics()
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load topics.');
        setLoading(false);
      });
  }, []);

  return { topics, loading, error };
}
