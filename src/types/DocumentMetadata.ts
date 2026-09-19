export interface DocumentMetadata {
  id: string;
  title?: string;
  source?: string;
  type?: "pdf" | "txt";
  language?: string;
  metadata?: Record<string, unknown>;
}
