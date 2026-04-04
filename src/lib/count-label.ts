export function formatCountLabel(count: number, singular: string, plural?: string) {
  const label = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${label}`;
}
