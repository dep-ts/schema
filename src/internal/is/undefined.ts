export function isUndefined(data: unknown): data is undefined {
  return Object.is(data, undefined);
}
