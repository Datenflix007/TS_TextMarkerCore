import test from "node:test";
import assert from "node:assert/strict";
import { findTextOccurrences } from "@datenflix007/ts-text-marker-core";

test("package self-reference resolves the built public API", () => {
  assert.deepEqual(findTextOccurrences("bellum bellum", "bellum"), [
    {
      start: 0,
      end: 6,
      quote: "bellum",
      occurrence: 1
    },
    {
      start: 7,
      end: 13,
      quote: "bellum",
      occurrence: 2
    }
  ]);
});
