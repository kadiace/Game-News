import { TodayNewsItemDto } from '../../types/api';

type Props = {
  item: TodayNewsItemDto;
};

export function NewsCard({ item }: Props) {
  return (
    <article style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, width: '100%' }}>
      <h3 style={{ marginTop: 0 }}>{item.title}</h3>
      <p style={{ color: '#555' }}>{item.summaryShort}</p>
      <p style={{ marginBottom: 0 }}>
        <a href={item.sourceUrl} target="_blank" rel="noreferrer">
          {item.sourceName}
        </a>
      </p>
    </article>
  );
}
