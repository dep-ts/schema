export function isBigInt(data: unknown): data is bigint {
  return typeof data === 'bigint';
}
