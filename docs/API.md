# API Reference 🧩

This document lists the public schema builders and utilities available in
`@dep/schema`.

## Import

```ts
import { s } from '@dep/schema';
```

You can also import named exports directly:

```ts
import { number, object, string } from '@dep/schema';
```

---

## Overview

### Primitives

- `s.string()`
- `s.number()`
- `s.boolean()`
- `s.bigint()`
- `s.symbol()`
- `s.null()`
- `s.undefined()`

### Special

- `s.any()`
- `s.unknown()`
- `s.never()`
- `s.void()`
- `s.nan()`

### Literals

- `s.literal(value)`
- `s.enum(values)`
- `s.templateLiteral(parts)`

### Structural

- `s.array(schema)`
- `s.object(shape)`
- `s.tuple(items)`
- `s.record(keySchema, valueSchema?)`
- `s.map(keySchema, valueSchema)`
- `s.set(schema)`
- `s.promise(schema)`
- `s.function(config)`
- `s.instanceof(constructor)`
- `s.file()`
- `s.date()`
- `s.json()`
- `s.lazy(() => schema)`

### Utilities

- `s.union([...schemas])`
- `s.intersection(left, right)`
- `s.optional(schema)`
- `s.exactOptional(schema)`
- `s.nonoptional(schema)`
- `s.nullable(schema)`
- `s.default(schema, value)`
- `s.prefault(schema, value)`
- `s.catch(schema, value)`
- `s.transform(schema, fn)`
- `s.pipe(inputSchema, outputSchema)`
- `s.readonly(schema)`
- `s.success(schema)`
- `s.clone(schema)`

### String Formats

- `s.email()`
- `s.url()`
- `s.httpUrl()`
- `s.uuid()`
- `s.uuidv1()`
- `s.uuidv2()`
- `s.uuidv3()`
- `s.uuidv4()`
- `s.uuidv5()`
- `s.uuidv6()`
- `s.uuidv7()`
- `s.uuidv8()`
- `s.guid()`
- `s.nanoid()`
- `s.cuid()`
- `s.cuid2()`
- `s.ulid()`
- `s.xid()`
- `s.ksuid()`
- `s.emoji()`
- `s.base64()`
- `s.base64url()`
- `s.jwt()`
- `s.ipv4()`
- `s.ipv6()`
- `s.cidrv4()`
- `s.cidrv6()`
- `s.e164()`
- `s.tel()`
- `s.stringFormat(format, pattern)`

### ISO Strings

- `s.iso.date()`
- `s.iso.datetime()`
- `s.iso.duration()`
- `s.iso.time()`

### Number Formats

- `s.int()`
- `s.int32()`
- `s.uint32()`
- `s.float32()`
- `s.float64()`
- `s.numberFormat(name)`

### BigInt Formats

- `s.int64()`
- `s.uint64()`
- `s.bigintFormat(name)`

### Coercion

- `s.coerce.string()`
- `s.coerce.number()`
- `s.coerce.boolean()`
- `s.coerce.bigint()`
- `s.coerce.date()`

---

## Core Parsing API

Every schema supports:

- `schema.parse(data)`
- `schema.parseAsync(data)`
- `schema.safeParse(data)`
- `schema.safeParseAsync(data)`

### Example

```ts
import { s } from '@dep/schema';

const User = s.object({
  name: s.string().min(2),
  age: s.number().int().positive(),
});

const result = User.safeParse({
  name: 'Ada',
  age: 20,
});

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.issues);
}
```

---

## Primitive Schemas

### `s.string()`

Creates a string schema.

```ts
const Name = s.string();
```

Common string methods:

- `.startsWith(value)`
- `.endsWith(value)`
- `.includes(value)`
- `.lowercase()`
- `.uppercase()`
- `.regex(pattern)`
- `.min(length)`
- `.max(length)`
- `.length(length)`
- `.nonempty()`
- `.trim()`
- `.toLowerCase()`
- `.toUpperCase()`

### `s.number()`

Creates a number schema.

```ts
const Age = s.number();
```

Common number methods:

- `.gt(value)`
- `.gte(value)`
- `.min(value)`
- `.lt(value)`
- `.lte(value)`
- `.max(value)`
- `.int()`
- `.positive()`
- `.nonnegative()`
- `.negative()`
- `.nonpositive()`
- `.multipleOf(value)`

### `s.boolean()`

Creates a boolean schema.

```ts
const Enabled = s.boolean();
```

### `s.bigint()`

Creates a bigint schema.

```ts
const Id = s.bigint();
```

### `s.symbol()`

Creates a symbol schema.

```ts
const Token = s.symbol();
```

### `s.null()`

Creates a null schema.

```ts
const OnlyNull = s.null();
```

### `s.undefined()`

Creates an undefined schema.

```ts
const OnlyUndefined = s.undefined();
```

---

## Special Schemas

### `s.any()`

Accepts any value.

### `s.unknown()`

Accepts unknown values.

### `s.never()`

Rejects all values.

### `s.void()`

Validates `undefined` as `void`.

### `s.nan()`

Validates `NaN`.

---

## Literal Schemas

### `s.literal(value)`

Validates a single literal value.

```ts
const Role = s.literal('admin');
```

### `s.enum(values)`

Validates enum-like values.

```ts
const Status = s.enum(['draft', 'published']);
```

### `s.templateLiteral(parts)`

Builds a template-literal-based schema.

```ts
const UserId = s.templateLiteral(['user_', s.number()]);
```

---

## Structural Schemas

### `s.array(schema)`

Creates an array schema.

```ts
const Tags = s.array(s.string());
```

### `s.object(shape)`

Creates an object schema.

```ts
const User = s.object({
  name: s.string(),
  age: s.number(),
});
```

Useful object helpers may include:

- `.strict()`
- `.strip()`
- `.loose()`
- `.catchall(schema)`
- `.extend(shape)`
- `.safeExtend(shape)`
- `.partial()`
- `.required()`
- `.pick(keys)`
- `.omit(keys)`
- `.keyof()`

### `s.tuple(items)`

Creates a fixed-length tuple schema.

```ts
const Point = s.tuple([s.number(), s.number()]);
```

### `s.record(keySchema, valueSchema?)`

Creates a record schema.

```ts
const Scores = s.record(s.string(), s.number());
```

### `s.map(keySchema, valueSchema)`

Creates a `Map` schema.

```ts
const Lookup = s.map(s.string(), s.number());
```

### `s.set(schema)`

Creates a `Set` schema.

```ts
const UniqueTags = s.set(s.string());
```

### `s.promise(schema)`

Creates a promise schema.

```ts
const AsyncName = s.promise(s.string());
```

### `s.function(config)`

Creates a function schema.

```ts
const Fn = s.function({
  input: [s.string()],
  output: s.number(),
});
```

### `s.instanceof(constructor)`

Validates instances of a class.

```ts
const ErrorSchema = s.instanceof(Error);
```

### `s.file()`

Creates a file schema.

### `s.date()`

Creates a date schema.

### `s.json()`

Validates JSON-compatible values.

### `s.lazy(factory)`

Creates a lazily evaluated schema.

```ts
const Tree = s.lazy(() =>
  s.object({
    value: s.string(),
    children: s.array(Tree).optional(),
  })
);
```

---

## Utility Schemas

### `s.union(schemas)`

Accepts one of multiple schemas.

```ts
const Value = s.union([s.string(), s.number()]);
```

### `s.intersection(left, right)`

Combines two schemas.

```ts
const Entity = s.intersection(
  s.object({ id: s.number() }),
  s.object({ name: s.string() }),
);
```

### `s.optional(schema)`

Allows `undefined`.

### `s.exactOptional(schema)`

Exact optional wrapper.

### `s.nonoptional(schema)`

Removes optionality.

### `s.nullable(schema)`

Allows `null`.

### `s.default(schema, value)`

Provides a fallback when input is `undefined`.

```ts
const Name = s.default(s.string(), 'Anonymous');
```

### `s.prefault(schema, value)`

Pre-parse fallback value.

### `s.catch(schema, value)`

Returns a fallback value when parsing fails.

### `s.transform(schema, fn)`

Transforms parsed output.

```ts
const Length = s.transform(s.string(), (value) => value.length);
```

### `s.pipe(inputSchema, outputSchema)`

Pipes one schema into another.

```ts
const Piped = s.pipe(
  s.string().transform((v) => Number(v)),
  s.number().positive(),
);
```

### `s.readonly(schema)`

Marks output as readonly.

### `s.success(schema)`

Wraps successful parsing semantics.

### `s.clone(schema)`

Clones a schema definition.

---

## String Format Schemas

### Identity & IDs

- `s.uuid()`
- `s.uuidv1()`
- `s.uuidv2()`
- `s.uuidv3()`
- `s.uuidv4()`
- `s.uuidv5()`
- `s.uuidv6()`
- `s.uuidv7()`
- `s.uuidv8()`
- `s.guid()`
- `s.nanoid()`
- `s.cuid()`
- `s.cuid2()`
- `s.ulid()`
- `s.xid()`
- `s.ksuid()`

### Network & URLs

- `s.url()`
- `s.httpUrl()`
- `s.ipv4()`
- `s.ipv6()`
- `s.cidrv4()`
- `s.cidrv6()`

### Communication

- `s.email()`
- `s.e164()`
- `s.tel()`

### Encodings & Tokens

- `s.base64()`
- `s.base64url()`
- `s.jwt()`

### Misc

- `s.emoji()`
- `s.stringFormat(format, pattern)`

Example:

```ts
const Email = s.email();
const Url = s.httpUrl();
const Token = s.jwt();
```

---

## ISO Schemas

Available under `s.iso`:

- `s.iso.date()`
- `s.iso.datetime()`
- `s.iso.duration()`
- `s.iso.time()`

```ts
const BirthDate = s.iso.date();
const Timestamp = s.iso.datetime();
```

---

## Number Format Schemas

### `s.int()`

Integer number schema.

### `s.int32()`

32-bit signed integer schema.

### `s.uint32()`

32-bit unsigned integer schema.

### `s.float32()`

32-bit floating point number schema.

### `s.float64()`

64-bit floating point number schema.

### `s.numberFormat(name)`

Generic number format schema.

```ts
const Port = s.uint32();
```

---

## BigInt Format Schemas

### `s.int64()`

64-bit signed bigint schema.

### `s.uint64()`

64-bit unsigned bigint schema.

### `s.bigintFormat(name)`

Generic bigint format schema.

```ts
const BigId = s.uint64();
```

---

## Coercion API

Available under `s.coerce`:

- `s.coerce.string()`
- `s.coerce.number()`
- `s.coerce.boolean()`
- `s.coerce.bigint()`
- `s.coerce.date()`

```ts
const Age = s.coerce.number().int().positive();
```

---

## Errors

Validation failures throw `SchemaError`.

```ts
import { s, SchemaError } from '@dep/schema';

try {
  s.number().parse('hello');
} catch (error) {
  if (error instanceof SchemaError) {
    console.log(error.issues);
  }
}
```

Each issue may include fields like:

- `code`
- `message`
- `path`
- `expected`
- `received`
- `format`
