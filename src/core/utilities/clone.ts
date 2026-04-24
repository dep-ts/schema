import { ExtendedDef } from '@internal/types';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { SomeSchema } from '@internal/types';

/**
 * Creates a shallow clone of a schema.
 *
 * @param schema - Schema to clone.
 * @param def - Optional definition overrides.
 * @returns Cloned schema.
 * @example
 * const cloned = clone(string());
 */
export function clone<T extends SomeSchema, TDef extends ExtendedDef<T>>(
  schema: T,
): T;

export function clone<T extends SomeSchema, TDef extends ExtendedDef<T>>(
  schema: T,
  def?: TDef,
): T;

export function clone<T extends SomeSchema, TDef extends ExtendedDef<T>>(
  schema: T,
  def?: TDef,
): T {
  const Ctor = schema.constructor as new (def: TDef) => T;
  const current = schema[SCHEMA_DEF];

  return new Ctor({
    ...current,
    ...def,
    checks: [...(def?.checks ?? current.checks ?? [])],
    values: def?.values ??
      (current.values ? new Set(current.values) : undefined),
  } as TDef);
}
