import type { Annotation } from "../types/Annotation.js";
import type { TextRange } from "../types/TextRange.js";
import { findTextOccurrences } from "./findTextOccurrences.js";

export function resolveAnnotationRange(
  text: string,
  annotation: Annotation
): TextRange | null {
  if (hasUsableExplicitRange(text, annotation)) {
    return {
      start: annotation.start,
      end: annotation.end
    };
  }

  if (annotation.quote.trim().length === 0) {
    return null;
  }

  const occurrence = annotation.occurrence ?? 1;

  if (!Number.isInteger(occurrence) || occurrence < 1) {
    return null;
  }

  const match = findTextOccurrences(text, annotation.quote).find(
    (textOccurrence) => textOccurrence.occurrence === occurrence
  );

  if (!match) {
    return null;
  }

  return {
    start: match.start,
    end: match.end
  };
}

function hasUsableExplicitRange(
  text: string,
  annotation: Annotation
): annotation is Annotation & Required<Pick<Annotation, "start" | "end">> {
  const { start, end } = annotation;

  return (
    typeof start === "number" &&
    typeof end === "number" &&
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    end >= start &&
    end <= text.length
  );
}
