import { writeFileSync } from "fs";
import { join } from "path";
import { BASE_URLS } from "../src/infra/config";
import type { ApiItem } from "./types"
import { toPascalCase } from "./utils";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/orgCountries";

async function main() {
  const res = await fetch(URL);
  const raw = await res.json();

  if (!Array.isArray(raw)) {
    throw new Error("Unexpected response: not an array");
  }
  const data: ApiItem[] = raw.map(item => {
    if (
        typeof item !== "object" ||
        item === null ||
        typeof (item as any).value !== "string"
    ) {
        throw new Error("Unexpected resposne: invalid item shape")
    }

    return { value: (item as any).value }
  });

  const entries = data
    .map(item => item.value)
    .filter(Boolean);

  // Deduplicate just in case
  const unique = Array.from(new Set(entries)).sort();

  const lines = unique.map(value => {
    const key = toPascalCase(value);

    // Edge case: keys starting with number
    const safeKey = /^[0-9]/.test(key) ? `_${key}` : key;

    return `   ${safeKey}: "${value}",`;
  });

  const output = `export const OrgCountry = {
${lines.join("\n")}
} as const;

export type OrgCountry = typeof OrgCountry[keyof typeof OrgCountry];
`;

  const OUTPUT_PATH = join(
    import.meta.dir,
    "../src/domain/types/enum/org-country.ts"
  )
  writeFileSync(OUTPUT_PATH, output);

  console.log(`Generated ${unique.length} org countries.`);
}

main();