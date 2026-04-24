// deno-lint-ignore-file no-explicit-any
import {
  NonOptionalSchema,
  OptionalSchema,
  Schema,
} from '@core/utilities/schema.ts';

import type {
  Extend,
  Flatten,
  InfertObjectInput,
  InfertObjectOutput,
  InternalObjectDef,
  Mask,
  ObjectDef,
  ObjectShape,
  Ref,
  SchemaIssue,
  SchemaKind,
  SomeSchema,
  Writeable,
} from '@internal/types';

import { isObject } from '@internal/is/object.ts';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_THROW_ISSUES,
} from '@internal/utils/symbols.ts';

import { clone } from '@core/utilities/clone.ts';
import { unknown } from '@core/special/unknown.ts';
import { never } from '@core/special/never.ts';
import { prefixCatchallIssues, prefixIssues } from '@internal/utils/format.ts';
import { isSchema } from '@internal/is/schema.ts';
import { enum as _enum, type EnumSchema } from '@core/literals/enum.ts';
import {
  extend as _extend,
  safeExtend as _safeExtend,
} from '@internal/utils/extend.ts';
import { _partial } from '@internal/utils/partial.ts';
import { _required } from '@internal/utils/require.ts';
import { _pick } from '@internal/utils/pick.ts';
import { _omit } from '@internal/utils/omit.ts';
import { defineLazy } from '@internal/utils/define.ts';

/** Schema for validating object values. */
export class ObjectSchema<
  TShape extends ObjectShape = ObjectShape,
> extends Schema<InfertObjectOutput<TShape>, InfertObjectInput<TShape>> {
  public override readonly kind: SchemaKind = 'ObjectSchema';
  declare [DEF_TYPE]: InternalObjectDef<TShape>;

  /**
   * The underlying shape definition containing the schemas for each key.
   */
  public readonly shape!: TShape;

  constructor(def: ObjectDef<TShape>) {
    super(def);

    defineLazy(this, 'shape', () => {
      return def.shape ?? ({} as TShape);
    });
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const { input, shape, catchall, issues } = this.#parseContext(data);
    const result: any = {};

    for (const key in shape) {
      const schema = shape[key];

      if (!isSchema(schema)) {
        throw new Error(`Invalid Schema at "${key}"`);
      }

      const propdata = input[key];
      const parseResult = schema.safeParse(propdata);

      if (!parseResult.success) {
        issues.push(...prefixIssues(parseResult.error.issues, key));
      }

      if (parseResult.success) {
        result[key] = parseResult.data;
      }
    }

    if (catchall) {
      const allowedKeys = new Set(Object.keys(shape));

      const unexpectedKeys = Object.keys(input).filter(
        (k) => !allowedKeys.has(k),
      );

      for (const unexpectedKey of unexpectedKeys) {
        const parseResult = catchall.safeParse(input[unexpectedKey]);

        if (!parseResult.success) {
          if (catchall.kind === 'NeverSchema') {
            issues.push(
              ...prefixCatchallIssues({
                issues: parseResult.error.issues,
                shape,
                input,
                unexpectedKey,
              }),
            );
          } else {
            issues.push(
              ...prefixIssues(parseResult.error.issues, unexpectedKey),
            );
          }
        }

        if (parseResult.success) {
          result[unexpectedKey] = parseResult.data;
        }
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const { input, shape, catchall, issues } = this.#parseContext(data);
    const result: any = {};

    for (const key in shape) {
      const schema = shape[key];

      if (!isSchema(schema)) {
        throw new Error(`Invalid Schema at "${key}"`);
      }

      const propdata = input[key];
      const parseResult = await schema.safeParseAsync(propdata);

      if (!parseResult.success) {
        issues.push(...prefixIssues(parseResult.error.issues, key));
      }

      if (parseResult.success) {
        result[key] = parseResult.data;
      }
    }

    if (catchall) {
      const allowedKeys = new Set(Object.keys(shape));

      const unexpectedKeys = Object.keys(input).filter(
        (k) => !allowedKeys.has(k),
      );

      for (const unexpectedKey of unexpectedKeys) {
        const parseResult = await catchall.safeParseAsync(input[unexpectedKey]);

        if (!parseResult.success) {
          if (catchall.kind === 'NeverSchema') {
            issues.push(
              ...prefixCatchallIssues({
                issues: parseResult.error.issues,
                shape,
                input,
                unexpectedKey,
              }),
            );
          } else {
            issues.push(
              ...prefixIssues(parseResult.error.issues, unexpectedKey),
            );
          }
        }

        if (parseResult.success) {
          result[unexpectedKey] = parseResult.data;
        }
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  /**
   * Disallows any keys not explicitly defined in the object shape.
   */
  strict(): this {
    return clone(this, { type: this.type, catchall: never() });
  }

  /**
   * Automatically removes any keys not explicitly defined in the object shape.
   */
  strip(): this {
    return clone(this, { type: this.type, catchall: undefined });
  }

  /**
   * Returns an Enum schema containing all the keys of the object shape.
   */
  keyof(): EnumSchema<Record<string, string>> {
    return _enum(Object.keys(this[SCHEMA_DEF].shape ?? []));
  }

  /**
   * Provides a schema to validate all unknown keys in the object.
   * @param schema - The schema to apply to unknown keys.
   */
  catchall<T extends SomeSchema>(schema: T): this {
    return clone(this, { type: schema.type, catchall: schema });
  }

  /**
   * Allows any unknown keys and preserves their original values.
   */
  loose(): this {
    return clone(this, { type: this.type, catchall: unknown() });
  }

  /**
   * Extends the current object shape with additional or overriding properties.
   * @param shape - The new properties to add.
   */
  extend<U extends ObjectShape>(shape: U): ObjectSchema<Extend<TShape, U>> {
    return _extend(
      this as unknown as ObjectSchema<ObjectShape>,
      shape,
    ) as unknown as ObjectSchema<Extend<TShape, U>>;
  }

  /**
   * Extends the current object shape with additional properties,
   * preventing accidental overrides of existing keys.
   * @param shape - The new properties to add.
   */
  safeExtend<U extends ObjectShape>(shape: U): ObjectSchema<Extend<TShape, U>> {
    return _safeExtend(
      this as unknown as ObjectSchema<ObjectShape>,
      shape,
    ) as unknown as ObjectSchema<Extend<TShape, U>>;
  }

  /**
   * Makes all properties (or a specific subset) optional.
   * @param mask - Optional mask to select specific keys.
   */
  partial(): ObjectSchema<
    {
      [k in keyof TShape]: OptionalSchema<TShape[k]>;
    }
  >;

  partial<M extends Mask<keyof TShape>>(
    mask: M & Record<Exclude<keyof M, keyof TShape>, never>,
  ): ObjectSchema<
    {
      [k in keyof TShape]: k extends keyof M ? OptionalSchema<TShape[k]>
        : TShape[k];
    }
  >;

  partial(mask?: any): any {
    return _partial(OptionalSchema, this, mask);
  }

  /**
   * Makes all properties (or a specific subset) required.
   * @param mask - Optional mask to select specific keys.
   */
  required(): ObjectSchema<
    {
      [k in keyof TShape]-?: NonOptionalSchema<Exclude<TShape[k], undefined>>;
    }
  >;

  required<M extends Mask<keyof TShape>>(
    mask: M & Record<Exclude<keyof M, keyof TShape>, never>,
  ): ObjectSchema<
    {
      [k in keyof TShape]-?: k extends keyof M
        ? NonOptionalSchema<Exclude<TShape[k], undefined>>
        : TShape[k];
    }
  >;

  required(mask?: any): any {
    return _required(NonOptionalSchema, this, mask);
  }

  /**
   * Returns a new schema containing only the specified keys.
   * @param mask - The keys to include in the new schema.
   */
  pick<M extends Mask<keyof TShape>>(
    mask: M & Record<Exclude<keyof M, keyof TShape>, never>,
  ): ObjectSchema<Flatten<Pick<TShape, Extract<keyof TShape, keyof M>>>> {
    return _pick(
      this as unknown as ObjectSchema<ObjectShape>,
      mask,
    ) as unknown as ObjectSchema<
      Flatten<Pick<TShape, Extract<keyof TShape, keyof M>>>
    >;
  }

  /**
   * Returns a new schema excluding the specified keys.
   * @param mask - The keys to remove from the new schema.
   */
  omit<M extends Mask<keyof TShape>>(
    mask: M & Record<Exclude<keyof M, keyof TShape>, never>,
  ): ObjectSchema<Flatten<Omit<TShape, Extract<keyof TShape, keyof M>>>> {
    return _omit(
      this as unknown as ObjectSchema<ObjectShape>,
      mask,
    ) as unknown as ObjectSchema<
      Flatten<Omit<TShape, Extract<keyof TShape, keyof M>>>
    >;
  }

  #parseContext(data: unknown): {
    input: Record<string, unknown>;
    shape: ObjectShape;
    catchall: SomeSchema<any> | undefined;
    issues: Array<Partial<SchemaIssue>>;
  } {
    const input = this[SCHEMA_ASSERT](isObject(data), {
      received: data,
    }) as Record<string, unknown>;
    const { shape, catchall } = this[SCHEMA_DEF];
    const issues: Array<Partial<SchemaIssue>> = [];

    return {
      input,
      shape: (shape ?? {}) as ObjectShape,
      catchall,
      issues,
    };
  }
}

/**
 * Creates an object schema.
 *
 * @param shape - Optional object shape definition.
 * @param message - Optional error message.
 * @returns Object schema.
 * @example
 * const schema = s.object({
 *   name: s.string(),
 * });
 */
export function object<TShape extends ObjectShape>(): ObjectSchema<
  Writeable<TShape>
>;
export function object<TShape extends ObjectShape>(
  shape?: TShape,
): ObjectSchema<Writeable<TShape>>;

export function object<TShape extends ObjectShape>(
  shape?: TShape,
  message?: string,
): ObjectSchema<Writeable<TShape>>;

export function object<TShape extends ObjectShape>(
  shape?: TShape,
  message?: string,
): ObjectSchema<Writeable<TShape>> {
  return new ObjectSchema({ type: 'object', shape, message });
}
