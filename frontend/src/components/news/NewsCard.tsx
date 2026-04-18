import { NewsListItemDto } from '../../types/api';

type Props = {
  item: NewsListItemDto;
};

export function NewsCard({ item }: Props) {
  return (
    <article
      style={{
        boxSizing: 'border-box',
        padding: 16,
        border: '1px solid #d0d7de',
        borderRadius: 12,
        width: '100%',
        minWidth: 0,
        background: '#ffffff',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
      }}
    >
      <p
        style={{
          display: 'inline-flex',
          marginTop: 0,
          marginBottom: 10,
          padding: '4px 10px',
          borderRadius: 999,
          background: '#eef2ff',
          color: '#3730a3',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        {item.topicDisplayName}
      </p>
      <h3 style={{ marginTop: 0, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h3>
      <p
        style={{
          color: '#475467',
          marginTop: 0,
          marginBottom: 12,
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {item.summaryShort}
      </p>
      <p style={{ marginTop: 0, marginBottom: 0, color: '#667085', fontSize: 14 }}>
        Source:{' '}
        <a href={item.sourceUrl} target="_blank" rel="noreferrer">
          {item.sourceName}
        </a>
      </p>
    </article>
  );
}
