import { SchemaIssue } from '@internal/types';
import { sortIssues } from '@internal/utils/sort-issues.ts';
import { JSONX } from '@internal/utils/jsonx.ts';

/** Error thrown when schema validation fails. */
export class SchemaError extends Error {
  public override readonly name = 'SchemaError';
  declare public readonly issues: SchemaIssue[];

  constructor(issues: Partial<SchemaIssue> | Partial<SchemaIssue>[]) {
    const issuesArray = Array.isArray(issues) ? issues : [issues];
    const sortedIssues = sortIssues(issuesArray);
    const message = JSONX.stringify(sortedIssues, 2);
    super(message);

    Object.defineProperty(this, 'issues', {
      value: sortedIssues,
      enumerable: false,
      writable: false,
      configurable: false,
    });
  }

  /**
   * Converts the error to a plain object for JSON serialization.
   * @returns An object containing error details and validation issues.
   */
  public toJSON(): {
    name: string;
    message: string;
    issues: SchemaIssue[];
  } {
    return {
      name: this.name,
      message: this.message,
      issues: this.issues,
    };
  }

  /**
   * Returns the string representation of the error (the formatted JSON message).
   */
  public override toString(): string {
    return this.message;
  }
}
