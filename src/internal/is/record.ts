import { isObject } from './object.ts';

export function isRecord(data: unknown): data is Record<PropertyKey, unknown> {
  if (isObject(data) === false) return false;

  const ctor = data.constructor;
  if (ctor === undefined) return true;
  if (typeof ctor !== 'function') return true;

  const prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  if (Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf') === false) {
    return false;
  }
  return true;
}
