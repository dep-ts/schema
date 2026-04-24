// deno-lint-ignore-file no-explicit-any
import { custom, type CustomSchema } from '@core/utilities/custom.ts';

function instanceof_<T>(instance: new (...args: any[]) => T): CustomSchema<T>;
function instanceof_<T>(
  instance: new (...args: any[]) => T,
  message?: string,
): CustomSchema<T>;

function instanceof_<T>(
  instance: new (...args: any[]) => T,
  message?: string,
): CustomSchema<T> {
  return custom<T>((data) => data instanceof instance, message);
}

export { instanceof_ as instanceof };
