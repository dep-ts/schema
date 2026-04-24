import { isNan } from './nan.ts';

export function isDate(data: unknown): data is Date {
  const isDate = data instanceof Date;
  return isDate && !isNan(data.getTime());
}
