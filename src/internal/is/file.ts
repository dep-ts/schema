export function isFile(data: unknown): data is File {
  return data instanceof File;
}
