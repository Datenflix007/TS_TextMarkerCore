import { describe, expect, it } from "vitest";
import type { Annotation } from "../src/index.js";
import {
  findTextOccurrences,
  resolveAnnotationRange
} from "../src/index.js";

describe("findTextOccurrences", () => {
  it("finds one occurrence", () => {
    expect(findTextOccurrences("bellum magnum", "bellum")).toEqual([
      {
        start: 0,
        end: 6,
        quote: "bellum",
        occurrence: 1
      }
    ]);
  });

  it("finds multiple occurrences", () => {
    expect(findTextOccurrences("bellum magnum bellum", "bellum")).toEqual([
      {
        start: 0,
        end: 6,
        quote: "bellum",
        occurrence: 1
      },
      {
        start: 14,
        end: 20,
        quote: "bellum",
        occurrence: 2
      }
    ]);
  });

  it("searches case-insensitively by default", () => {
    expect(findTextOccurrences("Bellum", "bellum")).toEqual([
      {
        start: 0,
        end: 6,
        quote: "Bellum",
        occurrence: 1
      }
    ]);
  });

  it("supports case-sensitive search", () => {
    expect(
      findTextOccurrences("Bellum bellum", "bellum", {
        caseSensitive: true
      })
    ).toEqual([
      {
        start: 7,
        end: 13,
        quote: "bellum",
        occurrence: 1
      }
    ]);
  });

  it("supports whole-word search", () => {
    expect(
      findTextOccurrences("bell bellum bell", "bell", {
        wholeWord: true
      })
    ).toEqual([
      {
        start: 0,
        end: 4,
        quote: "bell",
        occurrence: 1
      },
      {
        start: 12,
        end: 16,
        quote: "bell",
        occurrence: 2
      }
    ]);
  });

  it("returns an empty array when no occurrence exists", () => {
    expect(findTextOccurrences("pax romana", "bellum")).toEqual([]);
  });

  it("finds overlapping repeated words", () => {
    expect(findTextOccurrences("aaaa", "aa")).toEqual([
      {
        start: 0,
        end: 2,
        quote: "aa",
        occurrence: 1
      },
      {
        start: 1,
        end: 3,
        quote: "aa",
        occurrence: 2
      },
      {
        start: 2,
        end: 4,
        quote: "aa",
        occurrence: 3
      }
    ]);
  });
});

describe("resolveAnnotationRange", () => {
  const text = "bellum magnum bellum";

  it("prefers start and end", () => {
    const annotation: Annotation = {
      id: "ann-1",
      labelId: "conflict",
      quote: "bellum",
      occurrence: 2,
      start: 1,
      end: 4
    };

    expect(resolveAnnotationRange(text, annotation)).toEqual({
      start: 1,
      end: 4
    });
  });

  it("resolves occurrence 1", () => {
    expect(
      resolveAnnotationRange(text, {
        id: "ann-1",
        labelId: "conflict",
        quote: "bellum",
        occurrence: 1
      })
    ).toEqual({
      start: 0,
      end: 6
    });
  });

  it("resolves occurrence 2", () => {
    expect(
      resolveAnnotationRange(text, {
        id: "ann-1",
        labelId: "conflict",
        quote: "bellum",
        occurrence: 2
      })
    ).toEqual({
      start: 14,
      end: 20
    });
  });

  it("returns null when the requested occurrence does not exist", () => {
    expect(
      resolveAnnotationRange(text, {
        id: "ann-1",
        labelId: "conflict",
        quote: "bellum",
        occurrence: 3
      })
    ).toBeNull();
  });

  it("returns null when the quote is not found", () => {
    expect(
      resolveAnnotationRange(text, {
        id: "ann-1",
        labelId: "conflict",
        quote: "pax"
      })
    ).toBeNull();
  });
});
