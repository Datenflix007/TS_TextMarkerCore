import { describe, expect, it } from "vitest";
import type { AnnotationDocument } from "../src/index.js";
import { validateAnnotationDocument } from "../src/index.js";

function createValidDocument(): AnnotationDocument {
  return {
    version: "1.0",
    document: {
      id: "josephus-demo",
      title: "Flavius Josephus - Bellum Judaicum",
      type: "txt",
      language: "la"
    },
    labels: [
      {
        id: "person",
        name: "Person",
        color: "#7e57c2"
      },
      {
        id: "place",
        name: "Ort",
        color: "#ef5350"
      }
    ],
    annotations: [
      {
        id: "ann-001",
        labelId: "person",
        quote: "Vespasianus"
      },
      {
        id: "ann-002",
        labelId: "place",
        quote: "Hierosolyma",
        start: 10,
        end: 21
      }
    ]
  };
}

function expectInvalidPath(value: unknown, path: string): void {
  const result = validateAnnotationDocument(value);
  expect(result.valid).toBe(false);
  expect(result.errors.map((error) => error.path)).toContain(path);
}

describe("validateAnnotationDocument", () => {
  it("accepts a valid AnnotationDocument", () => {
    expect(validateAnnotationDocument(createValidDocument())).toEqual({
      valid: true,
      errors: []
    });
  });

  it("rejects a missing version", () => {
    const document = createValidDocument() as Record<string, unknown>;
    delete document["version"];

    expectInvalidPath(document, "$.version");
  });

  it("rejects an unknown version", () => {
    const document = createValidDocument();
    (document as unknown as { version: string }).version = "9.0";

    expectInvalidPath(document, "$.version");
  });

  it("rejects a missing document id", () => {
    const document = createValidDocument();
    document.document.id = "";

    expectInvalidPath(document, "$.document.id");
  });

  it("rejects duplicated label ids", () => {
    const document = createValidDocument();
    document.labels.push({
      id: "person",
      name: "Another Person",
      color: "#000000"
    });

    expectInvalidPath(document, "$.labels[2].id");
  });

  it("rejects duplicated annotation ids", () => {
    const document = createValidDocument();
    document.annotations.push({
      id: "ann-001",
      labelId: "person",
      quote: "Titus"
    });

    expectInvalidPath(document, "$.annotations[2].id");
  });

  it("rejects annotations that reference an unknown label", () => {
    const document = createValidDocument();
    document.annotations[0]!.labelId = "unknown";

    expectInvalidPath(document, "$.annotations[0].labelId");
  });

  it("rejects an empty quote", () => {
    const document = createValidDocument();
    document.annotations[0]!.quote = " ";

    expectInvalidPath(document, "$.annotations[0].quote");
  });

  it("rejects start greater than end", () => {
    const document = createValidDocument();
    document.annotations[0]!.start = 20;
    document.annotations[0]!.end = 10;

    expectInvalidPath(document, "$.annotations[0].end");
  });

  it("rejects occurrence 0", () => {
    const document = createValidDocument();
    document.annotations[0]!.occurrence = 0;

    expectInvalidPath(document, "$.annotations[0].occurrence");
  });

  it("rejects page 0", () => {
    const document = createValidDocument();
    document.annotations[0]!.page = 0;

    expectInvalidPath(document, "$.annotations[0].page");
  });

  it("rejects invalid bounding box values", () => {
    const document = createValidDocument();
    document.annotations[0]!.boundingBox = {
      x: 0,
      y: 0,
      width: -1,
      height: 10
    };

    expectInvalidPath(document, "$.annotations[0].boundingBox.width");
  });
});
