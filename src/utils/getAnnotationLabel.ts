import type { Annotation } from "../types/Annotation.js";
import type { AnnotationDocument } from "../types/AnnotationDocument.js";
import type { AnnotationLabel } from "../types/AnnotationLabel.js";

export function getLabelById(
  document: AnnotationDocument,
  labelId: string
): AnnotationLabel | undefined {
  return document.labels.find((label) => label.id === labelId);
}

export function getAnnotationLabel(
  document: AnnotationDocument,
  annotation: Annotation
): AnnotationLabel | undefined {
  return getLabelById(document, annotation.labelId);
}
