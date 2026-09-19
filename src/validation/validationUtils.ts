import type { ValidationError } from "../types/Validation.js";

export type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function hasOwn(record: UnknownRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0;
}

export function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 1;
}

export function validateOptionalString(
  errors: ValidationError[],
  value: UnknownRecord,
  key: string,
  path: string
): void {
  if (hasOwn(value, key) && typeof value[key] !== "string") {
    errors.push({
      path: `${path}.${key}`,
      message: `${key} must be a string.`
    });
  }
}

export function validateOptionalMetadata(
  errors: ValidationError[],
  value: UnknownRecord,
  path: string
): void {
  if (hasOwn(value, "metadata") && !isRecord(value["metadata"])) {
    errors.push({
      path: `${path}.metadata`,
      message: "metadata must be an object when provided."
    });
  }
}

export function validateBoundingBox(
  errors: ValidationError[],
  value: unknown,
  path: string
): void {
  if (!isRecord(value)) {
    errors.push({
      path,
      message: "boundingBox must be an object."
    });
    return;
  }

  for (const key of ["x", "y", "width", "height"]) {
    if (!hasOwn(value, key)) {
      errors.push({
        path: `${path}.${key}`,
        message: `${key} is required.`
      });
      continue;
    }

    if (!isFiniteNumber(value[key])) {
      errors.push({
        path: `${path}.${key}`,
        message: `${key} must be a finite number.`
      });
    }
  }

  if (isFiniteNumber(value["width"]) && value["width"] < 0) {
    errors.push({
      path: `${path}.width`,
      message: "width must be greater than or equal to 0."
    });
  }

  if (isFiniteNumber(value["height"]) && value["height"] < 0) {
    errors.push({
      path: `${path}.height`,
      message: "height must be greater than or equal to 0."
    });
  }

  if (hasOwn(value, "page") && !isPositiveInteger(value["page"])) {
    errors.push({
      path: `${path}.page`,
      message: "page must be an integer greater than or equal to 1."
    });
  }
}
