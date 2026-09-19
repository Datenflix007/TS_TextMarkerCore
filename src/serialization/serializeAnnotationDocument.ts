import type { AnnotationDocument } from "../types/AnnotationDocument.js";
import { validateAnnotationDocument } from "../validation/validateAnnotationDocument.js";

export interface SerializeAnnotationDocumentOptions {
  pretty?: boolean;
}

export function serializeAnnotationDocument(
  document: AnnotationDocument,
  options: SerializeAnnotationDocumentOptions = {}
): string {
  const result = validateAnnotationDocument(document);

  if (!result.valid) {
    const details = result.errors
      .map((validationError) => `${validationError.path}: ${validationError.message}`)
      .join("; ");
    throw new Error(`Cannot serialize invalid annotation document: ${details}`);
  }

  return JSON.stringify(document, null, options.pretty === true ? 2 : undefined);
}
