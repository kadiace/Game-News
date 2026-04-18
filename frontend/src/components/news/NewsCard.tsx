import { TodayNewsItemDto } from '../../types/api';

type Props = {
  item: TodayNewsItemDto;
};

export function NewsCard({ item }: Props) {
  const publishedLabel = item.publishedAt
    ? new Date(item.publishedAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  return (
    <article
      style={{
        padding: 16,
        border: '1px solid #d0d7de',
        borderRadius: 12,
        width: '100%',
        background: '#ffffff',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h3>
      <p style={{ color: '#475467', marginTop: 0, marginBottom: 12, lineHeight: 1.6 }}>{item.summaryShort}</p>
      <p style={{ marginTop: 0, marginBottom: 8, color: '#667085', fontSize: 14 }}>
        Source: {item.sourceName}
      </p>
      {publishedLabel ? <p style={{ marginTop: 0, marginBottom: 12, color: '#667085', fontSize: 14 }}>Published: {publishedLabel}</p> : null}
      <p style={{ marginBottom: 0 }}>
        <a href={item.sourceUrl} target="_blank" rel="noreferrer">
          Read original source
        </a>
      </p>
    </article>
  );
}
