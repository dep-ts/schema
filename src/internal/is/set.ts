export function isSet(data: unknown): data is Set<unknown> {
  return data instanceof Set;
}
