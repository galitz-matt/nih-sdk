import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";
import { BASE_URLS } from "../src/infra/config";
import { toPascalCase } from "./utils";
import { join } from "path";

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/arraType";

    const res = await Bun.fetch(URL);
    const raw = await res.json();

    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const data = raw.map(item => {
        if (
            typeof item !== "object" ||
            item === null ||
            typeof item.display !== "string" ||
            typeof item.value !== "string"
        ) {
            throw new Error("Unexpected response: invalid item");
        }

        const split: string[] = item.value.split(";");

        if (split.length > 1) {
            return {
                display: item.display,
                value: `[${split.map(v => `"${v}"`).join(", ")}]`
            }
        }
        return { display: item.display, value: `"${item.value}"` };
    });

    const unique = [
        ...new Map(
            data.map(item => [item.display, item])
        ).values()
    ];

    const output = render(
        seq(
            block(
                "export const ArraType = {",
                unique.map(item =>
                    line(`${toPascalCase(item.display)}: ${item.value},`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type ArraType = typeof ArraType[keyof typeof ArraType];")
        )
    );

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/arra-type.ts"
    );

    Bun.write(outputPath, output);

    console.log(`Generated ${unique.length} arraType types`);
}

main();