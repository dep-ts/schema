export function testRegex(pattern: RegExp, str: string) {
  const safe = new RegExp(pattern.source, pattern.flags.replace('g', ''));

  return safe.test(str);
}

export function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function cleanRegex(source: string): string {
  const start = source.startsWith('^') ? 1 : 0;
  const end = source.endsWith('$') ? source.length - 1 : source.length;
  return source.slice(start, end);
}
