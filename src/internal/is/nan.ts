export function isNan(data: unknown): data is number {
  return Number.isNaN(data);
}
