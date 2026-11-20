import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

/** @typedef {Record<string, unknown> & { items?: Record<string, unknown>[] }} Merged */

/**
 * @param {unknown} value
 * @returns {value is (target: object, source: object) => Merged}
 */
function isDeepmerge(value) {
  return typeof value === "function";
}

/**
 * @param {string} json
 * @returns {object}
 */
function parseObject(json) {
  /** @type {unknown} */
  const value = JSON.parse(json);
  if (typeof value !== "object" || value === null) {
    throw new TypeError("The JSON text must hold an object");
  }
  return value;
}

const exampleRequire = createRequire(
  new URL("../examples/sveltekit/package.json", import.meta.url),
);
const pluginRequire = createRequire(exampleRequire.resolve("@sveltejs/vite-plugin-svelte"));
/** @type {unknown} */
const loaded = pluginRequire("deepmerge");
if (!isDeepmerge(loaded)) {
  throw new TypeError("deepmerge must be a function");
}
const deepmerge = loaded;

await test("the Svelte build dependency rejects prototype poisoning on either side", () => {
  const poisoned = parseObject('{"__proto__":{"injected":true},"safe":1}');
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
  assert.equal(nested.items?.[0]?.injected, undefined);
  assert.deepEqual(nested, { items: [{ safe: 1 }] });
  assert.deepEqual(deepmerge({ items: [1] }, { items: [2] }), { items: [1, 2] });
});
