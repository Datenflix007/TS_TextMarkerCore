import type { ValidationError, ValidationResult } from "../types/Validation.js";
import { validateAnnotation } from "./validateAnnotation.js";
import {
  hasOwn,
  isNonEmptyString,
  isRecord,
  validateOptionalMetadata,
  validateOptionalString
} from "./validationUtils.js";

const SUPPORTED_VERSION = "1.0";

export function validateAnnotationDocument(value: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isRecord(value)) {
    return {
      valid: false,
      errors: [
        {
          path: "$",
          message: "AnnotationDocument must be an object."
        }
      ]
    };
  }

  validateVersion(errors, value);
  validateDocumentMetadata(errors, value["document"]);

  const labelIds = validateLabels(errors, value["labels"]);
  validateAnnotations(errors, value["annotations"], labelIds);

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateVersion(errors: ValidationError[], value: Record<string, unknown>): void {
  if (!hasOwn(value, "version")) {
    errors.push({
      path: "$.version",
      message: "version is required."
    });
    return;
  }

  if (value["version"] !== SUPPORTED_VERSION) {
    errors.push({
      path: "$.version",
      message: `version must be "${SUPPORTED_VERSION}".`
    });
  }
}

function validateDocumentMetadata(errors: ValidationError[], value: unknown): void {
  const path = "$.document";

  if (!isRecord(value)) {
    errors.push({
      path,
      message: "document must be an object."
    });
    return;
  }

  if (!isNonEmptyString(value["id"])) {
    errors.push({
      path: `${path}.id`,
      message: "id must be a non-empty string."
    });
  }

  validateOptionalString(errors, value, "title", path);
  validateOptionalString(errors, value, "source", path);
  validateOptionalString(errors, value, "language", path);

  if (
    hasOwn(value, "type") &&
    value["type"] !== "pdf" &&
    value["type"] !== "txt"
  ) {
    errors.push({
      path: `${path}.type`,
      message: 'type must be either "pdf" or "txt".'
    });
  }

  validateOptionalMetadata(errors, value, path);
}

function validateLabels(errors: ValidationError[], value: unknown): Set<string> {
  const labelIds = new Set<string>();

  if (!Array.isArray(value)) {
    errors.push({
      path: "$.labels",
      message: "labels must be an array."
    });
    return labelIds;
  }

  for (const [index, label] of value.entries()) {
    const path = `$.labels[${index}]`;

    if (!isRecord(label)) {
      errors.push({
        path,
        message: "label must be an object."
      });
      continue;
    }

    const id = label["id"];
    if (!isNonEmptyString(id)) {
      errors.push({
        path: `${path}.id`,
        message: "id must be a non-empty string."
      });
    } else if (labelIds.has(id)) {
      errors.push({
        path: `${path}.id`,
        message: `label id "${id}" is duplicated.`
      });
    } else {
      labelIds.add(id);
    }

    if (!isNonEmptyString(label["name"])) {
      errors.push({
        path: `${path}.name`,
        message: "name must be a non-empty string."
      });
    }

    if (!isNonEmptyString(label["color"])) {
      errors.push({
        path: `${path}.color`,
        message: "color must be a non-empty string."
      });
    }

    validateOptionalString(errors, label, "description", path);
    validateOptionalMetadata(errors, label, path);
  }

  return labelIds;
}

function validateAnnotations(
  errors: ValidationError[],
  value: unknown,
  labelIds: ReadonlySet<string>
): void {
  if (!Array.isArray(value)) {
    errors.push({
      path: "$.annotations",
      message: "annotations must be an array."
    });
    return;
  }

  const seenAnnotationIds = new Set<string>();

  for (const [index, annotation] of value.entries()) {
    errors.push(
      ...validateAnnotation(annotation, {
        labelIds,
        path: `$.annotations[${index}]`,
        seenAnnotationIds
      })
    );
  }
}
