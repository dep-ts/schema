import { ArraySchema, UnionSchema } from '@core/utilities/schema.ts';

import { StringSchema } from '@core/primitives/string/string.ts';
import { NumberSchema } from '@core/primitives/number/number.ts';
import { BooleanSchema } from '@core/primitives/boolean.ts';
import { NullSchema } from '@core/primitives/null.ts';
import { RecordSchema } from '@core/structural/record.ts';
import { LazySchema } from '@core/structural/lazy.ts';

export type JSONSchema = LazySchema<
  UnionSchema<
    readonly [
      StringSchema,
      NumberSchema,
      BooleanSchema,
      NullSchema,
      ArraySchema<JSONSchema>,
      RecordSchema<StringSchema, JSONSchema>,
    ]
  >
>;
