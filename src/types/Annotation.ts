import type { BoundingBox } from "./BoundingBox.js";

export interface Annotation {
  id: string;
  labelId: string;
  quote: string;
  page?: number;
  occurrence?: number;
  start?: number;
  end?: number;
  boundingBox?: BoundingBox;
  comment?: string;
  metadata?: Record<string, unknown>;
}
