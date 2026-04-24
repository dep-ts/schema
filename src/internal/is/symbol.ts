export function isSymbol(data: unknown): data is symbol {
  return typeof data === 'symbol';
}
