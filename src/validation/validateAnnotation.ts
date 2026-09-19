import type { ValidationError } from "../types/Validation.js";
import {
  hasOwn,
  isNonEmptyString,
  isNonNegativeInteger,
  isPositiveInteger,
  isRecord,
  validateBoundingBox,
  validateOptionalMetadata,
  validateOptionalString
} from "./validationUtils.js";

interface ValidateAnnotationOptions {
  labelIds: ReadonlySet<string>;
  path: string;
  seenAnnotationIds: Set<string>;
}

export function validateAnnotation(
  value: unknown,
  options: ValidateAnnotationOptions
): ValidationError[] {
  const errors: ValidationError[] = [];
  const { labelIds, path, seenAnnotationIds } = options;

  if (!isRecord(value)) {
    return [
      {
        path,
        message: "annotation must be an object."
      }
    ];
  }

  const id = value["id"];
  if (!isNonEmptyString(id)) {
    errors.push({
      path: `${path}.id`,
      message: "id must be a non-empty string."
    });
  } else if (seenAnnotationIds.has(id)) {
    errors.push({
      path: `${path}.id`,
      message: `annotation id "${id}" is duplicated.`
    });
  } else {
    seenAnnotationIds.add(id);
  }

  const labelId = value["labelId"];
  if (!isNonEmptyString(labelId)) {
    errors.push({
      path: `${path}.labelId`,
      message: "labelId must be a non-empty string."
    });
  } else if (!labelIds.has(labelId)) {
    errors.push({
      path: `${path}.labelId`,
      message: `labelId "${labelId}" does not reference an existing label.`
    });
  }

  if (!isNonEmptyString(value["quote"])) {
    errors.push({
      path: `${path}.quote`,
      message: "quote must be a non-empty string."
    });
  }

  if (hasOwn(value, "page") && !isPositiveInteger(value["page"])) {
    errors.push({
      path: `${path}.page`,
      message: "page must be an integer greater than or equal to 1."
    });
  }

  if (hasOwn(value, "occurrence") && !isPositiveInteger(value["occurrence"])) {
    errors.push({
      path: `${path}.occurrence`,
      message: "occurrence must be an integer greater than or equal to 1."
    });
  }

  const hasStart = hasOwn(value, "start");
  const hasEnd = hasOwn(value, "end");

  if (hasStart && !isNonNegativeInteger(value["start"])) {
    errors.push({
      path: `${path}.start`,
      message: "start must be an integer greater than or equal to 0."
    });
  }

  if (hasEnd && !isNonNegativeInteger(value["end"])) {
    errors.push({
      path: `${path}.end`,
      message: "end must be an integer greater than or equal to 0."
    });
  }

  if (hasStart !== hasEnd) {
    errors.push({
      path,
      message: "start and end must be provided together."
    });
  }

  if (
    isNonNegativeInteger(value["start"]) &&
    isNonNegativeInteger(value["end"]) &&
    value["start"] > value["end"]
  ) {
    errors.push({
      path: `${path}.end`,
      message: "end must be greater than or equal to start."
    });
  }

  if (hasOwn(value, "boundingBox")) {
    validateBoundingBox(errors, value["boundingBox"], `${path}.boundingBox`);
  }

  validateOptionalString(errors, value, "comment", path);
  validateOptionalMetadata(errors, value, path);

  return errors;
}
