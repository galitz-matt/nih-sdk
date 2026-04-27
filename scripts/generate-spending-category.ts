import { BASE_URLS } from "../src/infra/config";
import { toPascalCase } from "./utils";
import { join } from "path";
import { writeFileSync } from "fs";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/spendingCategories"

async function main() {
    const res = await fetch(URL);
    const raw = await res.json();

    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const entries = raw.map(item => {
        if (!item.display || !item.value) {
        throw new Error("Unexpected response: item missing display and/or value");
        }

        return {
            key: toPascalCase(item.display),
            value: item.value,
        };
    });

    const unique = Array.from(
        new Map(entries.map(e => [e.key, e])).values()
    ).sort((a, b) => a.key.localeCompare(b.key));

    const lines = unique.map(e => `   ${e.key}: ${e.value},`);

    const output = `export const SpendingCategory = {
${lines.join("\n")}
} as const;

export type SpendingCategory = typeof SpendingCategory[keyof typeof SpendingCategory];
`;
    const OUTPUT_PATH = join(
        import.meta.dir,
        "../src/domain/types/enum/spending-category.ts"
    );

    writeFileSync(OUTPUT_PATH, output);

    console.log(`Generated ${unique.length} spending categories`);
}

main();