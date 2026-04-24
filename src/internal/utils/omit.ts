import { ObjectSchema } from '@core/structural/object.ts';
import { clone } from '@core/utilities/clone.ts';
import { Mask, ObjectShape } from '@internal/types';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { mergeDefs } from '@internal/utils/def.ts';
import { assignProp } from '@internal/utils/prop.ts';

export function _omit<
  TShape extends Partial<ObjectShape>,
  M extends Mask<keyof TShape>,
>(schema: ObjectSchema<ObjectShape>, mask: M): ObjectSchema<ObjectShape> {
  const currDef = schema[SCHEMA_DEF];
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(
      '.omit() cannot be used on object schemas containing refinements',
    );
  }
  const def = mergeDefs(schema[SCHEMA_DEF], {
    get shape() {
      const newShape = { ...schema[SCHEMA_DEF].shape };
      for (const key in mask) {
        if (!(key in (currDef.shape ?? {}))) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key]) continue;
        delete newShape[key];
      }
      assignProp(this, 'shape', newShape);
      return newShape;
    },
    checks: [],
    type: schema.type,
  });
  return clone(schema, { ...def, type: schema.type });
}
