import { isNumber } from './number.ts';
import { isString } from './string.ts';
import { isSymbol } from './symbol.ts';

export function isPropertyKey(data: unknown): data is PropertyKey {
  return isString(data) || isNumber(data) || isSymbol(data);
}
