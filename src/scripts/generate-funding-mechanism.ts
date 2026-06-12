import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";
import { BASE_URLS } from "../infra/config";
import { toPascalCase } from "./utils";
import { join } from "path";

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/fundingMechanism";
    
    const res = await Bun.fetch(URL);
    const raw = await res.json();

    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const data = raw.map(item => {
        if (
            typeof item !== "object" ||
            item === null ||
            typeof (item as any).display !== "string" ||
            typeof (item as any).value !== "string"
        ) {
            throw new Error("Unexpected response: invalid item shape");
        }

        return { display: item.display, value: item.value };
    });

    const unique = [...new Set(data)];

    const output = render(
        seq(
            block(
                "export const FundingMechanism = {",
                data.map(item => 
                    line(`${toPascalCase(item.display)}: "${item.value}",`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type FundingMechanism = typeof FundingMechanism[keyof typeof FundingMechanism];")
        )
    );

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/funding-mechanism.ts"
    );

    Bun.write(outputPath, output);

    console.log(`Generated ${unique.length} funding mechanisms`);
}

main();