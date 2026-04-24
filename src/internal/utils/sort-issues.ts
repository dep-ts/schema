// deno-lint-ignore-file no-explicit-any
import { SchemaIssue } from '@internal/types';

export function sortIssues(
  issuesArray: Array<Partial<SchemaIssue>>,
): Array<SchemaIssue> {
  const formatOrder: Array<keyof SchemaIssue> = [
    'code',
    'message',
    'path',
    'received',
    'expected',
    'format',
  ];

  return issuesArray.map((issue) => {
    return formatOrder.reduce((acc, key) => {
      const value = issue[key];

      if (key === 'path') {
        (acc as any)[key] = value ?? [];
      }

      if (value !== undefined) {
        (acc as Record<string, any>)[key] ??= value;
      }

      return acc;
    }, {} as SchemaIssue);
  });
}
