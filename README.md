# @dep/schema 🧩

> A lightweight, type-safe schema validation library for TypeScript and
> JavaScript.

## [![JSR version](https://jsr.io/badges/@dep/schema)](https://jsr.io/@dep/schema)

## Features ✨

- 🛡️ Type-safe schemas with accurate input/output inference
- ⚡ Fast, composable validation primitives
- 🧱 Rich support for primitives, objects, arrays, unions, and transforms
- 🔗 Chainable API for defaults, optionality, nullability, pipes, and
  refinements
- 🧪 Structured validation errors with detailed issue paths

## Available Schemas 📚

- **Primitives**: `s.string()`, `s.number()`, `s.boolean()`, `s.bigint()`,
  `s.symbol()`
- **Literals**: `s.literal()`, `s.enum()`, `s.templateLiteral()`
- **Structural**: `s.object()`, `s.array()`, `s.tuple()`, `s.record()`,
  `s.map()`, `s.set()`
- **Utilities**: `s.union()`, `s.intersection()`, `s.optional()`,
  `s.nullable()`, `s.default()`, `s.transform()`
- **Formats**: `s.email()`, `s.url()`, `s.uuid()`, `s.ipv4()`, `s.iso.date()`,
  and [more](./docs/API.md)

---

## Installation 📦

- **Deno**:

  ```bash
  deno add jsr:@dep/schema
  ```

- **Node.js (18+) or Browsers**:

  ```bash
  npx jsr add @dep/schema
  ```

  Then import as an ES module:

  ```ts
  import { s } from '@dep/schema';
  ```

---

## Usage 🎯

### API 🧩

```ts
import { s } from '@dep/schema';

const User = s.object({
  name: s.string().min(3),
  age: s.number().int().positive(),
});

const result = User.safeParse({
  name: 'Estarlin',
  age: 25,
});

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.issues);
}
```

### More Examples

```ts
import { s } from '@dep/schema';

const Tags = s.array(s.string().nonempty());
const Status = s.union([s.literal('draft'), s.literal('published')]);

console.log(Tags.parse(['ts', 'deno']));
console.log(Status.parse('draft'));
```

```ts
import { s } from '@dep/schema';

const DisplayName = s
  .string()
  .transform((value) => value.trim())
  .default('Anonymous');

console.log(DisplayName.parse(undefined)); // "Anonymous"
```

---

## License 📄

MIT License – see [LICENSE](LICENSE) for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))
