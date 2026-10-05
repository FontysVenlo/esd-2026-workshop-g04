import test from "node:test";
import assert from "node:assert/strict";
import { add } from "../site/calculator.js";

test("adds two positive numbers", () => {
  assert.equal(add(2, 3), 5);
});

test("adds negative numbers", () => {
  assert.equal(add(-2, -3), -5);
});

test("adding zero preserves the number", () => {
  assert.equal(add(7, 0), 7);
});

test("adds decimal numbers", () => {
  assert.equal(add(1.5, 2.5), 4);
});