import { writeFileSync } from "fs";
import { join } from "path";
import { BASE_URLS } from "../src/infra/config";
import type { ApiItemWithChildren } from "./types";
import { toPascalCase } from "./utils";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/orgStates"

async function main() {
  const res = await fetch(URL);
  const raw = await res.json();

  if (!Array.isArray(raw)) {
    throw new Error("Unexpected response: not an array");
  }

  const data: ApiItemWithChildren[] = raw;

  const leaves = data.filter(item => item.children_values === null);

  const entries = leaves.map(item => {
    if (!item.name) {
      throw new Error(`Missing name for value: ${item.value}`);
    }

    return {
      key: toPascalCase(item.name),
      value: item.value,
    };
  });

  const unique = Array.from(
    new Map(entries.map(e => [e.key, e])).values()
  ).sort((a, b) => a.key.localeCompare(b.key));

  const lines = unique.map(e => `   ${e.key}: "${e.value}",`);

  const output = `export const OrgState = {
${lines.join("\n")}
} as const;

export type OrgState = typeof OrgState[keyof typeof OrgState];
`;

  const OUTPUT_PATH = join(
    import.meta.dir,
    "../src/domain/types/enum/org-state.ts"
  )
  writeFileSync(OUTPUT_PATH, output);

  console.log(`Generated ${unique.length} org states/territories.`);
}

main();