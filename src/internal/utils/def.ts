import { ExtendedDef, SomeSchema } from '@internal/types';

export function mergeDefs<T extends SomeSchema>(
  ...defs: Array<ExtendedDef<T>>
) {
  const properties = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(properties, descriptors);
  }
  return Object.defineProperties({}, properties);
}
