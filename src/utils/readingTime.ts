export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function readingTimeMinutes(content: string): number {
  const words = (content || '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
