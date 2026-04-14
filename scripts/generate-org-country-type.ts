import { writeFileSync } from "fs";
import { join } from "path";

const URL = "https://reporter.nih.gov/services/Lookup/orgCountries";

type ApiItem = {
  value: string;
};

function toPascalCase(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9 ]/g, " ")   // remove symbols like /, ', etc.
    .split(/\s+/)
    .filter((w): w is string => w.length > 0)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

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
        throw new Error("Invalid item shape")
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

    return `  ${safeKey}: "${value}",`;
  });

  const output = `export const OrgCountry = {
${lines.join("\n")}
} as const;

export type OrgCountry = typeof OrgCountry[keyof typeof OrgCountry];
`;

  const OUTPUT_PATH = join(
    import.meta.dir,
    "../src/domain/types/org/org-country.ts"
  )
  writeFileSync(OUTPUT_PATH, output);

  console.log(`Generated ${unique.length} org countries.`);
}

main();