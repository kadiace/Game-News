import { TodayNewsResponseDto, TopicDto } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function fetchTopics(): Promise<TopicDto[]> {
  return request<TopicDto[]>('/topics');
}

export function fetchTodayNews(targetDate?: string): Promise<TodayNewsResponseDto> {
  const query = targetDate ? `?targetDate=${encodeURIComponent(targetDate)}` : '';
  return request<TodayNewsResponseDto>(`/news/today${query}`);
}

export function subscribe(email: string) {
  return request('/subscribers', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function unsubscribe(email: string) {
  return request('/subscribers/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
