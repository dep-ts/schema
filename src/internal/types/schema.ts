// deno-lint-ignore-file no-explicit-any
import { SchemaError } from '@core/utilities/error.ts';
import {
  DEF_TYPE,
  INPUT_TYPE,
  OUTPUT_TYPE,
  SCHEMA_DEF,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import { MaybeAsync } from './utils.ts';
import { Ref } from './utils.ts';

export type SchemaKind =
  | 'TupleSchema'
  | 'EmojiSchema'
  | 'UUIDSchema'
  | 'GUIDSchema'
  | 'CUIDSchema'
  | 'CUID2Schema'
  | 'NanoIDSchema'
  | 'ULIDSchema'
  | 'XIDSchema'
  | 'KSUIDchema'
  | 'IPv4Schema'
  | 'IPv6Schema'
  | 'E164Schema'
  | 'CIDRv4Schema'
  | 'CIDRv6Schema'
  | 'JWTSchema'
  | 'PrefaultSchema'
  | 'SuccessSchema'
  | 'IntSchema'
  | 'CatchSchema'
  | 'Int32Schema'
  | 'Int64Schema'
  | 'UInt32Schema'
  | 'UInt64Schema'
  | 'Float32Schema'
  | 'Float64Schema'
  | 'DateSchema'
  | 'FunctionSchema'
  | 'SetSchema'
  | 'FileSchema'
  | 'Base64URLSchema'
  | 'PromiseSchema'
  | 'Base64Schema'
  | 'MapSchema'
  | 'TelSchema'
  | 'URLSchema'
  | 'ReadonlySchema'
  | 'UnionSchema'
  | 'CheckSchema'
  | 'NeverSchema'
  | 'UnknownSchema'
  | 'StringSchema'
  | 'RegexSchema'
  | 'EndsWithSchema'
  | 'StartsWithSchema'
  | 'IntersectionSchema'
  | 'TransformSchema'
  | 'BigIntSchema'
  | 'UpperCaseSchema'
  | 'LowerCaseSchema'
  | 'VoidSchema'
  | 'RefineSchema'
  | 'BooleanSchema'
  | 'ArraySchema'
  | 'LazySchema'
  | 'RecordSchema'
  | 'ObjectSchema'
  | 'OptionalSchema'
  | 'NonOptionalSchema'
  | 'LiteralSchema'
  | 'InstanceOfSchema'
  | 'NullSchema'
  | 'NullableSchema'
  | 'OrSchema'
  | 'AndSchema'
  | 'AnySchema'
  | 'ISODateSchema'
  | 'ISODateTimeSchema'
  | 'ISODurationSchema'
  | 'ISOTimeSchema'
  | 'DefaultSchema'
  | 'UndefinedSchema'
  | 'EnumSchema'
  | 'NaNSchema'
  | 'NumberSchema'
  | 'SymbolSchema'
  | 'CustomSchema'
  | 'EmailSchema'
  | 'StringSchemaCoerced'
  | 'NumberSchemaCoerced'
  | 'BigIntSchemaCoerced'
  | 'BooleanSchemaCoerced'
  | 'DateSchemaCoerced'
  | 'TemplateLiteralSchema'
  | 'ExactOptionalSchema'
  | 'PipeSchema';

export type _SchemaType =
  | 'nan'
  | 'string'
  | 'literal'
  | 'boolean'
  | 'number'
  | 'bigint'
  | 'symbol'
  | 'undefined'
  | 'file'
  | 'promise'
  | 'set'
  | 'map'
  | 'enum'
  | 'date'
  | 'null'
  | 'tuple'
  | 'array'
  | 'custom'
  | 'record'
  | 'object'
  | 'function'
  | 'error'
  | 'promise'
  | 'regexp'
  | 'default'
  | 'response'
  | 'nonoptional'
  | 'optional'
  | 'nullable'
  | 'union'
  | 'unknown'
  | 'never'
  | 'any'
  | 'void'
  | 'catch'
  | 'transform'
  | 'intersection'
  | 'prefault'
  | 'success'
  | 'lazy'
  | 'readonly'
  | 'template_literal';

export type SchemaType =
  | 'string'
  | 'number'
  | 'int'
  | 'boolean'
  | 'bigint'
  | 'symbol'
  | 'null'
  | 'undefined'
  | 'void'
  | 'never'
  | 'any'
  | 'unknown'
  | 'date'
  | 'object'
  | 'record'
  | 'file'
  | 'array'
  | 'tuple'
  | 'union'
  | 'intersection'
  | 'map'
  | 'set'
  | 'enum'
  | 'literal'
  | 'nullable'
  | 'optional'
  | 'nonoptional'
  | 'success'
  | 'transform'
  | 'default'
  | 'prefault'
  | 'catch'
  | 'nan'
  | 'pipe'
  | 'readonly'
  | 'template_literal'
  | 'promise'
  | 'lazy'
  | 'function'
  | 'custom';

export interface SchemaIssue {
  code: string;
  message: string;
  path: Array<PropertyKey>;
  received?: unknown;
  expected?: unknown;
  format?: string;
}

export type Params = string | Partial<SchemaIssue>;

export type CheckFn<T> = (payload: {
  issues: Array<Partial<SchemaIssue>>;
  data: T;
}) => MaybeAsync<void>;

export type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseError;

export type SafeParseSuccess<T> = {
  success: true;
  data: T;
};

export type SafeParseError = {
  success: false;
  error: SchemaError;
};

export interface SomeSchema<T = any, I = T> {
  kind: SchemaKind;
  readonly [INPUT_TYPE]: I;
  readonly [OUTPUT_TYPE]: T;
  readonly [DEF_TYPE]: InternalSchemaDef<T>;
  type: this[Ref<'DEF'>]['type'];
  [SCHEMA_DEF]: this[Ref<'DEF'>];
  [SCHEMA_PATTERN]: () => RegExp | undefined;
  parse(data: unknown): T;
  parseAsync(data: unknown): Promise<T>;
  safeParse(data: unknown): SafeParseResult<T>;
  safeParseAsync(data: unknown): Promise<SafeParseResult<T>>;
  check(...checks: Array<CheckFn<T>>): this;
}

export interface SchemaDef<T> {
  type: SchemaType;
  checks?: Array<CheckFn<T>>;
  values?: Set<PropertyKey>;
  message?: string;
}

export interface InternalSchemaDef<T> extends SchemaDef<T> {
  checks: Array<CheckFn<T>>;
}

export interface ExtendedDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>]
  > {
  [x: string]: any;
}
