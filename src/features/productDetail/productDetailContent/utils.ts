export const truncateMiddle = (text?: string | null, s = 6, e = 6) => {
  const t = String(text ?? '');
  return t.length <= s + e ? t : `${t.slice(0, s)}…${t.slice(-e)}`;
};

export function toTwoDecimals(v: unknown): string {
  if (v == null) return '—';
  const num = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(num)) return String(v);
  return num.toFixed(2);
}

export function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’'‘`"]/g, "'")
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}