export function isNull(data: unknown): data is null {
  return Object.is(data, null);
}
