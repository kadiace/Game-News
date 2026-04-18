export interface CollectedSourceItem {
  sourceUrl: string;
  title: string;
  body: string;
  author: string | null;
  publishedAt: string | null;
}

export interface SourceAdapter {
  fetchItems(): Promise<CollectedSourceItem[]>;
}
