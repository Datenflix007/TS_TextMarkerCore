import type { Annotation } from "./Annotation.js";
import type { AnnotationLabel } from "./AnnotationLabel.js";
import type { DocumentMetadata } from "./DocumentMetadata.js";

export interface AnnotationDocument {
  version: "1.0";
  document: DocumentMetadata;
  labels: AnnotationLabel[];
  annotations: Annotation[];
}
