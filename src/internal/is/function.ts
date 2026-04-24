// deno-lint-ignore-file no-explicit-any
export function isFunction(data: unknown): data is (...args: any[]) => any {
  return typeof data === 'function';
}
