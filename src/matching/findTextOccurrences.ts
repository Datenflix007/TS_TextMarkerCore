export interface FindTextOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
}

export interface TextOccurrence {
  start: number;
  end: number;
  quote: string;
  occurrence: number;
}

export function findTextOccurrences(
  text: string,
  query: string,
  options: FindTextOptions = {}
): TextOccurrence[] {
  const { caseSensitive = false, wholeWord = false } = options;

  if (query.length === 0 || text.length === 0 || query.length > text.length) {
    return [];
  }

  const comparableQuery = caseSensitive ? query : query.toLowerCase();
  const occurrences: TextOccurrence[] = [];
  const maxStart = text.length - query.length;

  for (let start = 0; start <= maxStart; start += 1) {
    const end = start + query.length;
    const quote = text.slice(start, end);
    const comparableQuote = caseSensitive ? quote : quote.toLowerCase();

    if (comparableQuote !== comparableQuery) {
      continue;
    }

    if (wholeWord && !isWholeWordMatch(text, start, end)) {
      continue;
    }

    occurrences.push({
      start,
      end,
      quote,
      occurrence: occurrences.length + 1
    });
  }

  return occurrences;
}

function isWholeWordMatch(text: string, start: number, end: number): boolean {
  const before = start > 0 ? text.slice(start - 1, start) : "";
  const after = end < text.length ? text.slice(end, end + 1) : "";

  return !isWordCharacter(before) && !isWordCharacter(after);
}

function isWordCharacter(value: string): boolean {
  return value.length > 0 && /^[\p{L}\p{N}_]$/u.test(value);
}
