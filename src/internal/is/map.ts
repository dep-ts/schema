export function isMap(data: unknown): data is Map<unknown, unknown> {
  return data instanceof Map;
}
