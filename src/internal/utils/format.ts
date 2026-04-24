import { isBigInt } from '@internal/is/bigint.ts';
import { InfertObjectOutput, ObjectShape, SchemaIssue } from '@internal/types';

export function format(data: unknown, literal = false) {
  if (literal) {
    if (isBigInt(data)) {
      return `${data}n`;
    } else {
      return data;
    }
  }

  if (Array.isArray(data)) return 'array';
  return typeof data;
}

export function prefixRecordIssues(
  key: PropertyKey,
  issues: Array<SchemaIssue>,
): Array<Partial<SchemaIssue>> {
  return issues.map((issue) => ({
    ...issue,
    path: [key, ...issue.path],
  }));
}

export function prefixCatchallIssues<TShape extends Partial<ObjectShape>>(opt: {
  issues: SchemaIssue[];
  shape: ObjectShape;
  input: InfertObjectOutput<TShape>;
  unexpectedKey: string;
}): Array<Partial<SchemaIssue>> {
  function quoteJoin(items: string[]) {
    return items.map((k) => `'${k.replace(/'/g, "''")}'`).join(', ');
  }

  return opt.issues.map((issue) => ({
    ...issue,
    code: 'unrecognized_keys',
    expected: quoteJoin(Object.keys(opt.shape)),
    received: quoteJoin(Object.keys(opt.input)),
    path: [opt.unexpectedKey, ...issue.path],
  }));
}

export function prefixUnrecognizedIssue(
  received: unknown,
  unrecognized: string[],
  message?: string,
): Partial<SchemaIssue> {
  return {
    received: received,
    code: 'unrecognized_keys',
    message: message ?? `Unrecognized keys: ${unrecognized.join(', ')}`,
    path: unrecognized,
  };
}

export function prefixIssues(issues: SchemaIssue[], ___: number | string) {
  return issues.map((issue) => ({
    ...issue,
    path: [___, ...issue.path],
  }));
}
