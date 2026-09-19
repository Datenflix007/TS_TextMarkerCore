export interface NormalizeTextOptions {
  caseSensitive?: boolean;
  normalizeWhitespace?: boolean;
  trim?: boolean;
}

export function normalizeText(
  text: string,
  options: NormalizeTextOptions = {}
): string {
  const {
    caseSensitive = false,
    normalizeWhitespace = true,
    trim = true
  } = options;

  let normalized = text;

  if (normalizeWhitespace) {
    normalized = normalized.replace(/\s+/gu, " ");
  }

  if (trim) {
    normalized = normalized.trim();
  }

  if (!caseSensitive) {
    normalized = normalized.toLowerCase();
  }

  return normalized;
}
