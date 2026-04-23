import { BASE_URLS } from "../src/infra/config";
import type { ApiItemWithChildren } from "./types";
import { toPascalCase } from "./utils";
import { join } from "path"
import { writeFileSync } from "fs";

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/agencies"

    const res = await fetch(URL);
    const raw = await res.json();


    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const data: ApiItemWithChildren[] = raw;

    const entries = data.map(item => {
        if (!item.display || !item.value) {
            throw new Error("Unexpected response: item missing display and/or value");
        }
        return { 
            key: toPascalCase(item.display), 
            value: item.value 
        };
    });

    const unique = Array.from(
        new Map(entries.map(e => [e.key, e])).values()
    ).sort((a, b) => a.key.localeCompare(b.key));

    const lines = unique.map(e => `    ${e.key}: "${e.value}",`);

    const output = `export const Agency = {
${lines.join("\n")}
} as const;

export type Agency = typeof Agency[keyof typeof Agency];`

    const OUTPUT_PATH = join(
        import.meta.dir,
        "../src/domain/types/enum/agency.ts"
    );

    writeFileSync(OUTPUT_PATH, output);

    console.log(`Generated ${unique.length} agencies`);
}

main();