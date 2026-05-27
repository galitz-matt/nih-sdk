import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";
import { BASE_URLS } from "../src/infra/config";
import { join } from "path";
import { toPascalCase } from "./utils";

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/awardTypes";

    const res = await fetch(URL);
    const raw = await res.json();

    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const seen = new Set<string>();
    const data = raw.filter(item => {
        if (
            typeof item !== "object" ||
            item === null ||
            typeof item.value !== "string" ||
            typeof item.display !== "string"
        ) {
            throw new Error("Unexpected response: invalid item shape")
        }

        if (seen.has(item.value)) {
            return false;
        }
        seen.add(item.value);
        return true;
    })
    .map(item => ({
        value: item.value,
        display: item.display
    }));

    const output = render(
        seq(
            block(
                "export const AwardType = {",
                data.map(item =>
                    line(`${toPascalCase(item.display)}: "${item.value}",`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type AwardType = typeof AwardType[keyof typeof AwardType];")
        )
    )

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/award-type.ts"
    );

    Bun.write(outputPath, output);

    console.log(`Generated ${data.length} award types.`)
}

main();