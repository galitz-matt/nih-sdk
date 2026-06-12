import { BASE_URLS } from "../infra/config";
import { toPascalCase } from "./utils";
import { join } from "path";
import { writeFileSync } from "fs";
import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";


async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/spendingCategories"

    const res = await Bun.fetch(URL);
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

    const output = render(
        seq(
            block(
                "export const SpendingCategories = {",
                unique.map(item =>
                    line(`${item.key}: "${item.value}"`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type SpendingCategory = typeof SpendingCategory[keyof typeof SpendingCategory];")
        )
    );

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/spending-category.ts"
    );

    Bun.write(outputPath, output);

    console.log(`Generated ${unique.length} spending categories`);
}

main();