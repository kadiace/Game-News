import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { TopicDto, TopicKey } from '../../types/api';

type Props = {
  topics: TopicDto[];
  activeKey: TopicKey;
  onSelect?: (topicKey: TopicKey) => void;
  getHref?: (topicKey: TopicKey) => string;
};

const tabStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 14px',
  borderRadius: 999,
  border: '1px solid #d0d7de',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
} satisfies CSSProperties;

export function TopicTabs({ topics, activeKey, onSelect, getHref }: Props) {
  if (topics.length === 0) return null;

  return (
    <nav aria-label="Topic navigation" style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      {topics.map((topic) => (
        getHref ? (
          <Link
            key={topic.key}
            to={getHref(topic.key)}
            aria-current={topic.key === activeKey ? 'page' : undefined}
            style={{
              ...tabStyle,
              background: topic.key === activeKey ? '#111827' : '#ffffff',
              color: topic.key === activeKey ? '#ffffff' : '#111827',
            }}
          >
            {topic.displayName}
          </Link>
        ) : (
          <button
            key={topic.key}
            type="button"
            aria-pressed={topic.key === activeKey}
            onClick={() => onSelect?.(topic.key)}
            style={{
              ...tabStyle,
              background: topic.key === activeKey ? '#111827' : '#ffffff',
              color: topic.key === activeKey ? '#ffffff' : '#111827',
            }}
          >
            {topic.displayName}
          </button>
        )
      ))}
    </nav>
  );
}
