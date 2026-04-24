export function timeSource(precision?: number | null) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof precision === 'number'
    ? precision === -1
      ? `${hhmm}`
      : precision === 0
      ? `${hhmm}:[0-5]\\d`
      : `${hhmm}:[0-5]\\d\\.\\d{${precision}}`
    : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
