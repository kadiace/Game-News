export const CANONICAL_TIMEZONE = 'Asia/Seoul';

export function resolveCanonicalTargetDate(dateOverride?: string): string {
  if (dateOverride) {
    return dateOverride;
  }

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: CANONICAL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function getTargetDateRangeUtc(targetDate: string): { gte: Date; lt: Date } {
  const [year, month, day] = targetDate.split('-').map(Number);

  return {
    gte: new Date(Date.UTC(year, month - 1, day, -9, 0, 0)),
    lt: new Date(Date.UTC(year, month - 1, day + 1, -9, 0, 0)),
  };
}
