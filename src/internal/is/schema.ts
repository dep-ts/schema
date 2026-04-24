import { SomeSchema } from '@internal/types';
import { isObject } from './object.ts';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';

export function isSchema(data: unknown): data is SomeSchema {
  return isObject(data) && SCHEMA_DEF in data;
}
