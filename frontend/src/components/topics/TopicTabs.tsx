import { TopicDto } from '../../types/api';

type Props = {
  topics: TopicDto[];
  activeKey: string;
  onSelect: (topicKey: string) => void;
};

export function TopicTabs({ topics, activeKey, onSelect }: Props) {
  if (topics.length === 0) return null;

  return (
    <nav style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      {topics.map((topic) => (
        <button
          key={topic.key}
          type="button"
          onClick={() => onSelect(topic.key)}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #ddd',
            background: topic.key === activeKey ? '#ddd' : '#f5f5f5',
            cursor: 'pointer',
          }}
        >
          {topic.displayName}
        </button>
      ))}
    </nav>
  );
}
