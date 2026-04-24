import { isRecord } from '@internal/is/record.ts';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { mergeDefs } from '@internal/utils/def.ts';
import { clone } from '@core/utilities/clone.ts';
import { ObjectSchema } from '@core/structural/object.ts';

import { assignProp } from '@internal/utils/prop.ts';
import { ObjectShape } from '@internal/types';

export function extend(
  schema: ObjectSchema<ObjectShape>,
  shape: ObjectShape,
): ObjectSchema<ObjectShape> {
  if (!isRecord(shape)) {
    throw new Error('Invalid input to extend: expected a plain object');
  }

  const { checks } = schema[SCHEMA_DEF];

  if (checks && checks.length > 0) {
    const existingShape = schema[SCHEMA_DEF].shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
        throw new Error(
          'Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.',
        );
      }
    }
  }

  const def = mergeDefs(schema[SCHEMA_DEF], {
    get shape() {
      const _shape = { ...schema[SCHEMA_DEF].shape, ...shape };

      assignProp(this, 'shape', _shape);
      return _shape;
    },
    type: schema.type,
  });

  return clone(schema, {
    ...def,
    type: schema.type,
  });
}

export function safeExtend(
  schema: ObjectSchema<ObjectShape>,
  shape: ObjectShape,
) {
  if (!isRecord(shape)) {
    throw new Error('Invalid input to safeExtend: expected a plain object');
  }

  const def = mergeDefs(schema[SCHEMA_DEF], {
    get shape() {
      const _shape = { ...schema[SCHEMA_DEF].shape, ...shape };
      assignProp(this, 'shape', _shape);
      return _shape;
    },

    type: schema.type,
  });
  return clone(schema, {
    ...def,
    type: schema.type,
  });
}
