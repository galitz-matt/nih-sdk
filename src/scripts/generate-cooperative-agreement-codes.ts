import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";
import { BASE_URLS } from "../infra/config";
import { join } from "path"

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/cooperativeAgreementCodes";
    
    const res = await fetch(URL);
    const raw = await res.json();

    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const data: string[] = raw.map(item => {
        if (
            typeof item !== "object" ||
            item === null ||
            typeof item.value !== "string"
        ) {
            throw new Error("Unexpected response: invalid item shape")
        }
        return item.value;
    });

    const unique = [...new Set(data)];

    const output = render(
        seq(
            block(
                "export const CoopAgreementCode = {",
                unique.map(item =>
                    line(`${item}: "${item}",`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type CoopAgreementCode = typeof CoopAgreementCode[keyof typeof CoopAgreementCode];")
        )
    );

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/coop-agreement-code.ts"
    )

    Bun.write(outputPath, output);

    console.log(`Generated ${unique.length} cooperative agreement code types`);
}

main();