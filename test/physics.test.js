import test from "node:test";
import assert from "node:assert/strict";
import {
  COURT,
  circleIntersectsRect,
  clamp,
  isGameOver,
  racketBounds,
  scoreForOutOfBounds
} from "../src/physics.js";

test("clamp keeps values inside a range", () => {
  assert.equal(clamp(12, 0, 10), 10);
  assert.equal(clamp(-2, 0, 10), 0);
  assert.equal(clamp(6, 0, 10), 6);
});

test("racket collision detects shuttle contact", () => {
  const rect = racketBounds(450, COURT.playerY);
  assert.equal(circleIntersectsRect({ x: 450, y: COURT.playerY, radius: 10 }, rect), true);
  assert.equal(circleIntersectsRect({ x: 200, y: COURT.playerY, radius: 10 }, rect), false);
});

test("out of bounds scoring awards the correct side", () => {
  assert.equal(scoreForOutOfBounds({ x: 450, y: 640, vy: 7 }), "ai");
  assert.equal(scoreForOutOfBounds({ x: 450, y: 0, vy: -7 }), "player");
});

test("match ends when either side reaches the winning score", () => {
  assert.equal(isGameOver(11, 4), true);
  assert.equal(isGameOver(7, 11), true);
  assert.equal(isGameOver(10, 10), false);
});
