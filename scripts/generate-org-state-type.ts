import { writeFileSync } from "fs";
import { join } from "path";
import { BASE_URLS } from "../src/infra/config";
import type { ApiItemWithChildren } from "./types";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/orgStates"

function toPascalCase(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w): w is string => w.length > 0)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

async function main() {
  const res = await fetch(URL);
  const raw = await res.json();

  if (!Array.isArray(raw)) {
    throw new Error("Expected array from orgStates endpoint");
  }

  const data: ApiItemWithChildren[] = raw;

  // ✅ Only leaf nodes (actual states/territories)
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

  // Deduplicate + sort for stable output
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
    "../src/domain/types/org/org-state.ts"
  )
  writeFileSync(OUTPUT_PATH, output);

  console.log(`Generated ${unique.length} org states/territories.`);
}

main();