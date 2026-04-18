import { TodayNewsItemDto } from '../../types/api';
import { EmptyState } from '../states/EmptyState';
import { NewsCard } from './NewsCard';

type Props = {
  items: TodayNewsItemDto[];
  emptyMessage?: string;
};

export function NewsList({ items, emptyMessage }: Props) {
  if (items.length === 0) {
    return <EmptyState message={emptyMessage ?? 'No curated news items available for this topic yet.'} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
      {items.slice(0, 3).map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
