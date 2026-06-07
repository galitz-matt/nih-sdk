import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";
import { BASE_URLS } from "../src/infra/config";
import type { ApiItemWithChildren } from "./types";
import { toPascalCase } from "./utils";
import { join } from "path"

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/organizationTypes"

    const res = await Bun.fetch(URL);
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

    const output = render(
        seq(
            block(
                "export const OrgType = {",
                unique.map(item =>
                    line(`${item.key}: "${item.value}"`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type OrgType = typeof OrgType[keyof typeof OrgType];")
        )
    );

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/org-type.ts"
    );

    Bun.write(outputPath, output);

    console.log(`Generated ${unique.length} org types`);
}

main();