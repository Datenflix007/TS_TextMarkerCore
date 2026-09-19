export type { Annotation } from "./types/Annotation.js";
export type { AnnotationDocument } from "./types/AnnotationDocument.js";
export type { AnnotationLabel } from "./types/AnnotationLabel.js";
export type { BoundingBox } from "./types/BoundingBox.js";
export type { DocumentMetadata } from "./types/DocumentMetadata.js";
export type { TextRange } from "./types/TextRange.js";
export type { ValidationError, ValidationResult } from "./types/Validation.js";
export type {
  FindTextOptions,
  TextOccurrence
} from "./matching/findTextOccurrences.js";
export type { SerializeAnnotationDocumentOptions } from "./serialization/serializeAnnotationDocument.js";
export type { NormalizeTextOptions } from "./utils/normalizeText.js";

export { findTextOccurrences } from "./matching/findTextOccurrences.js";
export { resolveAnnotationRange } from "./matching/resolveAnnotationRange.js";
export { parseAnnotationDocument } from "./serialization/parseAnnotationDocument.js";
export { serializeAnnotationDocument } from "./serialization/serializeAnnotationDocument.js";
export { createAnnotationId } from "./utils/createAnnotationId.js";
export {
  getAnnotationLabel,
  getLabelById
} from "./utils/getAnnotationLabel.js";
export { normalizeText } from "./utils/normalizeText.js";
export { validateAnnotationDocument } from "./validation/validateAnnotationDocument.js";
