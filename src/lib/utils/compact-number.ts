export default function compactNumber(input: number | string): string {
  let num = typeof input === 'number' ? input : Number(input);

  if (isNaN(num)) {
    // throw new TypeError(`Invalid number: ${input}`);
    return 'N/A';
  }

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let tier = 0;

  while (num >= 10000 && tier < suffixes.length - 1) {
    num /= 1000;
    tier++;
  }

  return num >= 1000 ?
      `${(num / 1000).toFixed(1)}${suffixes[tier + 1]}`
    : `${Number(num.toFixed(num >= 100 ? 0 : 1))}${suffixes[tier]}`;
}
