import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

import { parse } from "yaml";

import { generateTracker, generateTypes, isSchema } from "./generate.js";

function main() {
  const { values } = parseArgs({
    options: {
      schema: { type: "string" },
      out: { type: "string" },
    },
  });

  const { out, schema: schemaFile } = values;
  if (schemaFile === undefined || schemaFile === "" || out === undefined || out === "") {
    console.error("Usage: alyt-codegen --schema <path> --out <dir>");
    process.exit(1);
  }

  const schemaPath = resolve(schemaFile);
  const outDir = resolve(out);

  const raw = readFileSync(schemaPath, "utf-8");
  const schema: unknown = parse(raw);
  if (!isSchema(schema)) {
    console.error(`${schemaPath} must define an events map`);
    process.exit(1);
  }

  const eventNames = Object.keys(schema.events);

  writeFileSync(resolve(outDir, "types.ts"), generateTypes(schema));
  writeFileSync(resolve(outDir, "tracker.ts"), generateTracker(schema));

  console.log(`Generated ${eventNames.length} events: types.ts and tracker.ts`);
}

main();
