import { TodayNewsItemDto } from '../../types/api';
import { EmptyState } from '../states/EmptyState';
import { NewsCard } from './NewsCard';

type Props = {
  items: TodayNewsItemDto[];
};

export function NewsList({ items }: Props) {
  if (items.length === 0) {
    return <EmptyState message="No curated news items available for this topic yet." />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
      {items.slice(0, 3).map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
