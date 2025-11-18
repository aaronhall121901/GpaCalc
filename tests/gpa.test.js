import test from "node:test";
import assert from "node:assert/strict";
import { calculateGPA, GRADE_POINTS } from "../src/gpa.js";

test("returns zeros for empty input", () => {
  const result = calculateGPA([]);
  assert.equal(result.credits, 0);
  assert.equal(result.qualityPoints, 0);
  assert.equal(result.gpa, 0);
});

test("computes GPA using the fixed 4.0 scale", () => {
  const result = calculateGPA([
    { grade: "A", credits: 4 },
    { grade: "B+", credits: 3 },
    { grade: "A-", credits: 2 },
  ]);

  assert.equal(result.credits, 9);
  assert.equal(result.qualityPoints, 33.3);
  assert.equal(result.gpa, Number((33.3 / 9).toFixed(3)));
});

test("ignores user-supplied points and invalid credits", () => {
  const result = calculateGPA([
    { grade: "B", credits: 3, points: 5 },
    { grade: "A", credits: "" },
    { grade: "C", credits: 0 },
  ]);

  assert.equal(result.credits, 3);
  assert.equal(result.gpa, GRADE_POINTS.B);
});
