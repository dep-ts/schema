import { ExtendedDef } from '@internal/types';
import { ObjectShape, SomeSchema } from '@internal/types';

export function assignProp(
  target: ExtendedDef<SomeSchema>,
  prop: string,
  value: ObjectShape,
) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
