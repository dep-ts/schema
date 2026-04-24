// deno-lint-ignore-file no-explicit-any
import { isBigInt } from '@internal/is/bigint.ts';

export function bigIntReplacer(_: any, value: any): any {
  if (isBigInt(value)) return `${value}n`;
  return value;
}

export function stringify(value: any, space?: string | number): string {
  return JSON.stringify(value, bigIntReplacer, space);
}

export const JSONX = { stringify };
