import { clone } from '@core/utilities/clone.ts';
import { NonOptionalSchema } from '@core/utilities/schema.ts';
import { ObjectShape, SomeSchema } from '@internal/types';
import { Mask } from '@internal/types';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { mergeDefs } from '@internal/utils/def.ts';
import { ObjectSchema } from '@core/structural/object.ts';
import { assignProp } from '@internal/utils/prop.ts';

export function _required<
  TShape extends ObjectShape,
  M extends Mask<keyof TShape>,
>(
  Class: typeof NonOptionalSchema<SomeSchema>,
  schema: ObjectSchema<TShape>,
  mask?: M,
): ObjectSchema<TShape> {
  const def = mergeDefs(schema[SCHEMA_DEF], {
    get shape() {
      const oldShape = (schema[SCHEMA_DEF].shape ?? {}) as ObjectShape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key]) continue;
          shape[key] = new Class({
            type: 'nonoptional',
            innerType: oldShape[key],
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class({
            type: 'nonoptional',
            innerType: oldShape[key],
          });
        }
      }
      assignProp(this, 'shape', shape);
      return shape;
    },
    type: schema.type,
  });
  return clone(schema, { ...def, type: schema.type });
}
