import type {
  InternalSuccessDef,
  Ref,
  SafeParseResult,
  SchemaKind,
  SuccessDef,
} from '@internal/types';
import { Schema } from '@core/utilities/schema.ts';
import { SomeSchema } from '@internal/types/schema.ts';
import {
  DEF_TYPE,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
} from '@internal/utils/symbols.ts';
import { SchemaError } from '@core/utilities/error.ts';

/** Schema that validates if the inner schema is successful and returns true. */
export class SuccessSchema<T extends SomeSchema = SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>],
  T[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'SuccessSchema';
  declare [DEF_TYPE]: InternalSuccessDef<T>;

  constructor(def: SuccessDef<T>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): true {
    const result = this[SCHEMA_DEF].innerType.safeParse(data);
    return this.#handleSuccess(result);
  }

  override async [SCHEMA_PARSE_ASYNC](data: unknown): Promise<true> {
    const result = await this[SCHEMA_DEF].innerType.safeParseAsync(data);
    return this.#handleSuccess(result);
  }

  #handleSuccess<T>(result: SafeParseResult<T>) {
    if (!result.success) {
      throw new SchemaError(result.error.issues);
    }
    return result.success;
  }
}

/**
 * Creates a success schema.
 *
 * @param innerType - Schema to validate.
 * @param message - Optional error message.
 * @returns Success schema.
 * @example
 * const schema = s.success(s.string());
 */
export function success<T extends SomeSchema>(innerType: T): SuccessSchema<T>;
export function success<T extends SomeSchema>(
  innerType: T,
  message?: string,
): SuccessSchema<T>;

export function success<T extends SomeSchema>(
  innerType: T,
  message?: string,
): SuccessSchema<T> {
  return new SuccessSchema({ type: 'success', innerType, message });
}
