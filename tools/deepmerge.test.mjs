import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const exampleRequire = createRequire(
  new URL("../examples/sveltekit/package.json", import.meta.url),
);
const pluginRequire = createRequire(exampleRequire.resolve("@sveltejs/vite-plugin-svelte"));
const deepmerge = pluginRequire("deepmerge");

test("the Svelte build dependency rejects prototype poisoning on either side", () => {
  const poisoned = JSON.parse('{"__proto__":{"injected":true},"safe":1}');
  for (const [target, source] of [
    [poisoned, {}],
    [{}, poisoned],
    [poisoned, poisoned],
  ]) {
    const result = deepmerge(target, source);
    assert.equal(Object.getPrototypeOf(result), Object.prototype);
    assert.equal(result.injected, undefined);
    assert.equal(result.safe, 1);
  }
  const nested = deepmerge({}, { items: [poisoned] });
  assert.equal(nested.items[0].injected, undefined);
  assert.deepEqual(nested, { items: [{ safe: 1 }] });
  assert.deepEqual(deepmerge({ items: [1] }, { items: [2] }), { items: [1, 2] });
});
