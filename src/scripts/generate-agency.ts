import { BASE_URLS } from "../infra/config";
import type { ApiItemWithChildren } from "./types";
import { toPascalCase } from "./utils";
import { join } from "path"
import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/agencies"

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

    const output = render(
        seq(
            block(
                "export const Agency = {",
                unique.map(item =>
                    line(`${item.key}: "${item.value}",`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type Agency = typeof Agency[keyof typeof Agency];")
        )
    )

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/agency.ts"
    );

    Bun.write(outputPath, output);

    console.log(`Generated ${unique.length} agencies`);
}

main();