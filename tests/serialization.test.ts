import { describe, expect, it } from "vitest";
import type { AnnotationDocument } from "../src/index.js";
import {
  parseAnnotationDocument,
  serializeAnnotationDocument
} from "../src/index.js";

function createDocument(): AnnotationDocument {
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
        id: "conflict",
        name: "Konflikt",
        color: "#ff9800"
      }
    ],
    annotations: [
      {
        id: "ann-001",
        labelId: "conflict",
        quote: "bellum",
        occurrence: 2
      }
    ]
  };
}

describe("serialization", () => {
  it("serializes and parses the same model", () => {
    const document = createDocument();
    const serialized = serializeAnnotationDocument(document);

    expect(parseAnnotationDocument(serialized)).toEqual(document);
  });

  it("supports pretty JSON", () => {
    const serialized = serializeAnnotationDocument(createDocument(), {
      pretty: true
    });

    expect(serialized).toContain('\n  "version": "1.0"');
  });

  it("rejects invalid JSON", () => {
    expect(() => parseAnnotationDocument("{")).toThrow(
      "Invalid annotation document JSON"
    );
  });

  it("rejects syntactically valid but semantically invalid JSON", () => {
    expect(() =>
      parseAnnotationDocument(
        JSON.stringify({
          version: "9.0",
          document: {
            id: "demo"
          },
          labels: [],
          annotations: []
        })
      )
    ).toThrow("Invalid annotation document");
  });

  it("does not serialize semantically invalid documents", () => {
    const document = createDocument();
    document.annotations[0]!.quote = "";

    expect(() => serializeAnnotationDocument(document)).toThrow(
      "Cannot serialize invalid annotation document"
    );
  });
});
