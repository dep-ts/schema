export function isNumber(data: unknown): data is number {
  return Number.isFinite(data);
}
