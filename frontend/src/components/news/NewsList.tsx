import { useEffect, useMemo, useState } from 'react';
import { NewsListItemDto } from '../../types/api';
import { EmptyState } from '../states/EmptyState';
import { NewsCard } from './NewsCard';

type Props = {
  items: NewsListItemDto[];
  emptyMessage?: string;
};

export function NewsList({ items, emptyMessage }: Props) {
  const groupedItems = useMemo(() => {
    const groups = new Map<string, NewsListItemDto[]>();

    items.forEach((item) => {
      const dateKey = item.publishedAt ? item.publishedAt.slice(0, 10) : 'undated';
      const existing = groups.get(dateKey) ?? [];
      existing.push(item);
      groups.set(dateKey, existing);
    });

    return Array.from(groups.entries())
      .sort(([left], [right]) => right.localeCompare(left))
      .map(([dateKey, groupItems]) => ({
        dateKey,
        label:
          dateKey === 'undated'
            ? 'Undated'
            : new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }),
        items: groupItems,
      }));
  }, [items]);

  const [expandedDateKey, setExpandedDateKey] = useState<string | null>(groupedItems[0]?.dateKey ?? null);

  useEffect(() => {
    if (groupedItems.length === 0) {
      setExpandedDateKey(null);
      return;
    }

    const hasExpandedGroup = groupedItems.some((group) => group.dateKey === expandedDateKey);

    if (!hasExpandedGroup) {
      setExpandedDateKey(groupedItems[0].dateKey);
    }
  }, [expandedDateKey, groupedItems]);

  if (items.length === 0) {
    return <EmptyState message={emptyMessage ?? 'No curated news items available for this topic yet.'} />;
  }

  return (
      <div style={{ display: 'grid', gap: 12 }}>
      {groupedItems.map((group, index) => {
        const isExpanded = expandedDateKey === null ? index === 0 : expandedDateKey === group.dateKey;

        return (
          <section
            key={group.dateKey}
            onMouseEnter={() => setExpandedDateKey(group.dateKey)}
            style={{
              border: '1px solid #d0d7de',
              borderRadius: 16,
              background: '#ffffff',
              overflow: 'hidden',
              boxShadow: isExpanded ? '0 10px 30px rgba(15, 23, 42, 0.08)' : '0 1px 2px rgba(15, 23, 42, 0.06)',
              transition: 'box-shadow 160ms ease, border-color 160ms ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '16px 18px',
                background: isExpanded ? '#eff6ff' : '#f8fafc',
                borderBottom: isExpanded ? '1px solid #dbeafe' : '1px solid transparent',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>{group.label}</h3>
                <p style={{ margin: '4px 0 0', color: '#667085', fontSize: 14 }}>
                  {group.items.length} article{group.items.length > 1 ? 's' : ''}
                </p>
              </div>
              <span style={{ color: '#475467', fontSize: 13, fontWeight: 600 }}>
                {isExpanded ? 'Expanded' : 'Hover to expand'}
              </span>
            </div>

            {isExpanded ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, padding: 16 }}>
                {group.items.map((item) => (
                  <NewsCard key={item.listKey} item={item} />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
