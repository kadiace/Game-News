import { TodayNewsResponseDto, TopicDto } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function isTopicDtoArray(value: unknown): value is TopicDto[] {
  return Array.isArray(value);
}

function isTodayNewsResponseDto(value: unknown): value is TodayNewsResponseDto {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<TodayNewsResponseDto>;
  return typeof candidate.targetDate === 'string' && Array.isArray(candidate.topics);
}

async function parseResponseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

function getErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  return `Request failed: ${status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await parseResponseBody<unknown>(response);
    throw new Error(getErrorMessage(body, response.status));
  }

  return parseResponseBody<T>(response);
}

export function fetchTopics(): Promise<TopicDto[]> {
  return request<unknown>('/topics').then((data) => {
    if (!isTopicDtoArray(data)) {
      throw new Error('Invalid topics response. Check VITE_API_BASE_URL or the Vite dev proxy.');
    }

    return data;
  });
}

export function fetchTodayNews(targetDate?: string): Promise<TodayNewsResponseDto> {
  const query = targetDate ? `?targetDate=${encodeURIComponent(targetDate)}` : '';
  return request<unknown>(`/news/today${query}`).then((data) => {
    if (!isTodayNewsResponseDto(data)) {
      throw new Error('Invalid today news response. Check VITE_API_BASE_URL or the Vite dev proxy.');
    }

    return data;
  });
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
