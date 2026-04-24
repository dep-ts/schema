import { assertEqual, assertThrows } from '@dep/assert';
import { file } from './file.ts';

Deno.test('FileSchema', async () => {
  const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
  const FileSchema = file();

  assertEqual(FileSchema.kind, 'FileSchema');
  assertEqual(FileSchema.type, 'file');

  assertEqual(FileSchema.parse(mockFile), mockFile);
  assertEqual(await FileSchema.parseAsync(mockFile), mockFile);

  assertThrows(() => FileSchema.parse(new Blob(['content']))); // Blob is not a File
  assertThrows(() => FileSchema.parse('not a file'));
  assertThrows(() => FileSchema.parse({ name: 'fake-file.txt' }));
  assertThrows(() => FileSchema.parse(null));
  assertThrows(() => FileSchema.parse(undefined));
});
