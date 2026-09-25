export type ConfigDiffLine = {
  kind: 'same' | 'removed' | 'added';
  text: string;
  oldLine: number | null;
  newLine: number | null;
};
// A bounded, line-oriented replacement diff. It is intentionally not quadratic LCS.
export function configDiff(before: string, after: string) {
  const a = before.split('\n');
  const b = after.split('\n');
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let end = 0;
  while (
    end < a.length - start &&
    end < b.length - start &&
    a[a.length - 1 - end] === b[b.length - 1 - end]
  )
    end++;
  const rows: ConfigDiffLine[] = [];
  let total = 0;
  const push = (row: ConfigDiffLine) => {
    total++;
    if (rows.length < 1000) rows.push(row);
  };
  for (let i = Math.max(0, start - 3); i < start; i++)
    push({ kind: 'same', text: a[i], oldLine: i + 1, newLine: i + 1 });
  for (let i = start; i < a.length - end; i++)
    push({ kind: 'removed', text: a[i], oldLine: i + 1, newLine: null });
  for (let i = start; i < b.length - end; i++)
    push({ kind: 'added', text: b[i], oldLine: null, newLine: i + 1 });
  for (let i = 0; i < Math.min(end, 3); i++)
    push({
      kind: 'same',
      text: a[a.length - end + i],
      oldLine: a.length - end + i + 1,
      newLine: b.length - end + i + 1,
    });
  return { rows, truncated: total > rows.length, identical: before === after };
}
