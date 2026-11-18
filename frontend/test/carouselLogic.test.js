import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Service 3D Carousel Monotonic Stepping Mathematics
 * Tests the virtual window algorithm implemented in Service3dCarousel.jsx
 */

function generateVirtualWindow(step, count) {
  if (count <= 0) return [];
  const items = [];
  for (let k = step - 4; k <= step + 4; k++) {
    const serviceIndex = ((k % count) + count) % count;
    items.push({
      virtualKey: k,
      pos: k - step,
      serviceIndex,
    });
  }
  return items;
}

test('Monotonic Stepping shifts ALL cards strictly right-to-left when step increments', () => {
  const count = 5; // 5 services in DB

  for (let step = 0; step < 25; step++) {
    const windowA = generateVirtualWindow(step, count);
    const windowB = generateVirtualWindow(step + 1, count);

    // Verify exactly 9 slots in pipeline
    assert.equal(windowA.length, 9);
    assert.equal(windowB.length, 9);

    // Verify center card at step is pos = 0
    const centerA = windowA.find((item) => item.pos === 0);
    assert.ok(centerA);
    assert.equal(centerA.virtualKey, step);
    assert.equal(centerA.serviceIndex, step % count);

    // When step -> step + 1, that same virtual card must shift to pos = -1 (leftward)
    const cardInWindowB = windowB.find((item) => item.virtualKey === step);
    assert.ok(cardInWindowB);
    assert.equal(cardInWindowB.pos, -1, 'Card must shift left from pos 0 to -1');

    // Across all common virtual keys between step and step + 1, movement is strictly -1
    for (const cardA of windowA) {
      const matchInB = windowB.find((b) => b.virtualKey === cardA.virtualKey);
      if (matchInB) {
        assert.equal(
          matchInB.pos - cardA.pos,
          -1,
          `Card ${cardA.virtualKey} must move strictly leftward (-1)`
        );
      }
    }
  }
});

test('Logical indexing loops smoothly without negative modulo artifacts', () => {
  const count = 7;
  for (let k = -20; k <= 20; k++) {
    const idx = ((k % count) + count) % count;
    assert.ok(idx >= 0 && idx < count, `Index ${idx} must be within [0, ${count - 1}]`);
  }
});
