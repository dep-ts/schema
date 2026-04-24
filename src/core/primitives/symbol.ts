import { isSymbol } from '@internal/is/symbol.ts';
import { Schema } from '@core/utilities/schema.ts';
import type { SchemaKind, SymbolDef } from '@internal/types';
import { SCHEMA_ASSERT, SCHEMA_PARSE } from '@internal/utils/symbols.ts';

/** Schema for validating `symbol` values. */
export class SymbolSchema extends Schema<symbol> {
  public override readonly kind: SchemaKind = 'SymbolSchema';

  constructor(def: SymbolDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): symbol {
    return this[SCHEMA_ASSERT](isSymbol(data), { received: data });
  }
}

/**
 * Creates a symbol schema.
 *
 * @param message - Optional error message.
 * @returns Symbol schema.
 * @example
 * const schema = s.symbol();
 */
export function symbol(): SymbolSchema;
export function symbol(message?: string): SymbolSchema;
export function symbol(message?: string): SymbolSchema {
  return new SymbolSchema({ type: 'symbol', message });
}
