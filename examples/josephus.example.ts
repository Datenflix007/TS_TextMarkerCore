import {
  findTextOccurrences,
  parseAnnotationDocument,
  resolveAnnotationRange
} from "@datenflix007/ts-text-marker-core";

const josephusAnnotationJson = `{
  "version": "1.0",
  "document": {
    "id": "josephus-demo"
  },
  "labels": [
    {
      "id": "person",
      "name": "Person",
      "color": "#7e57c2"
    },
    {
      "id": "conflict",
      "name": "Konflikt",
      "color": "#ff9800"
    }
  ],
  "annotations": [
    {
      "id": "ann-josephus-001",
      "labelId": "person",
      "quote": "Vespasianus"
    },
    {
      "id": "ann-josephus-002",
      "labelId": "conflict",
      "quote": "bellum",
      "occurrence": 2
    }
  ]
}`;

const text =
  "Vespasianus in Iudaea bellum gessit. Titus postea bellum apud Hierosolyma duxit.";

const annotationDocument = parseAnnotationDocument(josephusAnnotationJson);
const bellumOccurrences = findTextOccurrences(text, "bellum");
const resolvedRanges = annotationDocument.annotations.map((annotation) => ({
  annotationId: annotation.id,
  range: resolveAnnotationRange(text, annotation)
}));

export { annotationDocument, bellumOccurrences, resolvedRanges };
