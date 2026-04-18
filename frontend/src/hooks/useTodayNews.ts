import { useEffect, useState } from 'react';
import { fetchTodayNews } from '../lib/api';
import { TodayNewsResponseDto } from '../types/api';

export function useTodayNews(targetDate?: string) {
  const [news, setNews] = useState<TodayNewsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    setError(null);

    fetchTodayNews(targetDate)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setNews(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isActive) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load today news.');
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [targetDate]);

  return { news, loading, error };
}
