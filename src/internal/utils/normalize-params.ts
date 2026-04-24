import { isObject } from '@internal/is/object.ts';
import { isString } from '@internal/is/string.ts';
import type { Params, SchemaIssue } from '@internal/types';

export function normalizeParams(params?: Params): Partial<SchemaIssue> {
  if (isString(params)) return { message: params };
  if (isObject(params)) return params;
  return {};
}
