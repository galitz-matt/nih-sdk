import { writeFileSync } from "fs";
import { BASE_URLS } from "../src/infra/config";
import { join } from "path";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/fiscalYears";

async function main() {
    const res = await fetch(URL);
    const raw = await res.json();

    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const data: string[] = raw.map(item => {
        if (
            typeof item !== "object" ||
            item === null ||
            typeof (item as any).value !== "string"
        ) {
            throw new Error("Unexpected response: invalid item shape");
        }
        return item.value;
    });

    const unique = [ ...new Set(data) ].sort();

    const lines = unique.map(key => {
        const safeKey = /^[0-9]/.test(key) ? `_${key}` : key;
        return `    ${safeKey.toUpperCase()}: "${key}",`;
    })

    const output = `export const FiscalYear = {
${lines.join("\n")}
} as const;
export type FiscalYear = typeof FiscalYear[keyof typeof FiscalYear];
    `;

    const OUTPUT_PATH = join(
        import.meta.dir,
        "../src/domain/types/enum/fiscal-year.ts"
    )

    writeFileSync(OUTPUT_PATH, output);
}

main();