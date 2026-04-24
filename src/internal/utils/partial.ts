import { clone } from '@core/utilities/clone.ts';
import { OptionalSchema } from '@core/utilities/schema.ts';
import { ObjectShape, SomeSchema } from '@internal/types';
import { Mask } from '@internal/types';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { mergeDefs } from '@internal/utils/def.ts';
import { ObjectSchema } from '@core/structural/object.ts';
import { assignProp } from '@internal/utils/prop.ts';

export function _partial<
  TShape extends ObjectShape,
  M extends Mask<keyof TShape>,
>(
  Class: typeof OptionalSchema<SomeSchema>,
  schema: ObjectSchema<TShape>,
  mask?: M,
) {
  const currDef = schema[SCHEMA_DEF];
  const { checks } = currDef;

  if (checks && checks.length > 0) {
    throw new Error(
      '.partial() cannot be used on object schemas containing refinements',
    );
  }
  const def = mergeDefs(currDef, {
    get shape() {
      const oldShape = (currDef.shape ?? {}) as ObjectShape;
      const shape = { ...oldShape };

      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key]) continue;
          shape[key] = Class
            ? new Class({
              type: 'optional',
              innerType: oldShape[key],
            })
            : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class
            ? new Class({
              type: 'optional',
              innerType: oldShape[key as never] as ObjectSchema<ObjectShape>,
            })
            : oldShape[key];
        }
      }
      assignProp(this, 'shape', shape);

      return shape;
    },
    checks: [],
    type: schema.type,
  });

  return clone(schema, { ...def, type: schema.type });
}
