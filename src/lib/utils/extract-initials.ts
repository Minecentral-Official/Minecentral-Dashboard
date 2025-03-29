export function extractInitials(input: string): string {
  let result = '';
  const seen = new Set<string>();

  // Iterate over each character in the input with its index
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Check if the character is the first letter of a word or a capital letter
    if (
      (i === 0 || input[i - 1] === ' ' || (char >= 'A' && char <= 'Z')) &&
      !seen.has(char.toUpperCase())
    ) {
      result += char.toUpperCase();
      seen.add(char.toUpperCase());
    }

    // Break once we have 4 characters
    if (result.length >= 4) {
      break;
    }
  }

  return result;
}
