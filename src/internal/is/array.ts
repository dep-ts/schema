export function isArray(data: unknown): data is Array<unknown> {
  return Array.isArray(data);
}
