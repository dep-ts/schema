import { assertEqual, assertRejects, assertThrows } from '@dep/assert';
import { string } from '@core/primitives/string/string.ts';

Deno.test('schema', async () => {
  const base = string();

  // 1. Basic parse
  assertEqual(base.parse('hello'), 'hello');

  // 2. safeParse success
  const ok = base.safeParse('world');
  assertEqual(ok.success, true);

  // 3. safeParse failure
  const fail = base.safeParse(123);
  assertEqual(fail.success, false);

  // 4. Async parse
  assertEqual(await base.parseAsync('async'), 'async');

  await assertRejects(() => base.parseAsync(123));

  // 5. check
  const Checked = string().check(({ data, issues }) => {
    if (data.length < 3) {
      issues.push({ message: 'too short' });
    }
  });

  assertEqual(Checked.parse('abcd'), 'abcd');
  assertThrows(() => Checked.parse('a'));

  // 6. refine
  const Refined = string().refine((s) => s.length > 2);

  assertEqual(Refined.parse('abcd'), 'abcd');
  assertThrows(() => Refined.parse('a'));

  // 7. overwrite
  const Over = string().overwrite((s) => s.trim());

  assertEqual(Over.parse('  hi  '), 'hi');

  // 8. transform
  const Trans = string().transform((s) => s.length);

  assertEqual(Trans.parse('abcd'), 4);

  // 9. default
  const Def = string().default('fallback');
  assertEqual(Def.parse(undefined), 'fallback');

  // 10. optional
  const Opt = string().optional();
  assertEqual(Opt.parse(undefined), undefined);

  // 11. nullable
  const Null = string().nullable();
  assertEqual(Null.parse(null), null);

  // 12. nonoptional
  const NonOpt = string().optional().nonoptional();
  assertThrows(() => NonOpt.parse(undefined));

  // 13. readonly
  const Read = string().readonly();
  const r = Read.parse('x');
  assertEqual(Object.isFrozen(r), true);

  // 14. catch
  const Catch = string().catch('fallback');
  assertEqual(Catch.parse(123), 'fallback');

  // 15. pipe
  const Pipe = string()
    .transform((s) => s.trim())
    .pipe(string().transform((s) => s.toUpperCase()));

  assertEqual(Pipe.parse('  hi  '), 'HI');

  // 16. clone
  const cloned = base.clone();
  assertEqual(cloned.parse('ok'), 'ok');

  // 17. or (union)
  const Or = string().or(string());
  assertEqual(Or.parse('a'), 'a');

  // 18. and (intersection)
  const And = string().and(string());
  assertEqual(And.parse('a'), 'a');
});
