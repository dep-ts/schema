import { isNull } from './null.ts';
import { isObject } from './object.ts';

export function isPromiseLike<T = unknown>(data: unknown): data is Promise<T> {
  return (
    (isObject(data) &&
      !isNull(data) &&
      'then' in data &&
      typeof data.then === 'function') ||
    data instanceof Promise
  );
}
