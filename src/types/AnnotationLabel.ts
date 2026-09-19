export interface AnnotationLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
  metadata?: Record<string, unknown>;
}
