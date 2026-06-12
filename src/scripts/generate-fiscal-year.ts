import { writeFileSync } from "fs";
import { BASE_URLS } from "../infra/config";
import { join } from "path";
import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";
import { safeKey } from "./utils";

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

    const numbers = data.filter(item => !Number.isNaN(Number.parseInt(item)));
    const unique = [ ...new Set(numbers) ].sort();

    const lines = unique.map(key => {
        const safeKey = /^[0-9]/.test(key) ? `_${key}` : key;
        return `    ${safeKey.toUpperCase()}: ${key},`;
    })

    const output = render(
        seq(
            block(
                "export const FiscalYear = {",
                unique.map(value => 
                    line(`${safeKey(value).toUpperCase()}: ${value},`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type FiscalYear = typeof FiscalYear[keyof typeof FiscalYear];")
        )
    )

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/fiscal-year.ts"
    )

    writeFileSync(outputPath, output);

    console.log(`Generated ${unique.length} fiscal year values`)
}



main();