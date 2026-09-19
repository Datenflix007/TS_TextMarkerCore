import type { AnnotationDocument } from "../types/AnnotationDocument.js";
import { validateAnnotationDocument } from "../validation/validateAnnotationDocument.js";

export function parseAnnotationDocument(json: string): AnnotationDocument {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown JSON parse error.";
    throw new Error(`Invalid annotation document JSON: ${message}`);
  }

  const result = validateAnnotationDocument(parsed);

  if (!result.valid) {
    const details = result.errors
      .map((validationError) => `${validationError.path}: ${validationError.message}`)
      .join("; ");
    throw new Error(`Invalid annotation document: ${details}`);
  }

  return parsed as AnnotationDocument;
}
