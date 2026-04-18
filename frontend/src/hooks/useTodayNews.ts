import { useEffect, useState } from 'react';
import { fetchTodayNews } from '../lib/api';
import { TodayNewsResponseDto } from '../types/api';

export function useTodayNews(targetDate?: string) {
  const [news, setNews] = useState<TodayNewsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodayNews(targetDate)
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load today news.');
        setLoading(false);
      });
  }, [targetDate]);

  return { news, loading, error };
}
