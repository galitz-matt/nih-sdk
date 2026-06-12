import { BASE_URLS } from "../infra/config";
import { toPascalCase } from "./utils";
import { join } from "path";
import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/deptTypes"

async function main() {
    const res = await Bun.fetch(URL);
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

    const output = render(
        seq(
            block(
                "export const DeptType = {",
                unique.map(value => 
                    line(`${toPascalCase(value)}: "${value}",`)
                ),
                "} as const;"
            ),
            newline(),
            line("export type DeptType = typeof DeptType[keyof typeof DeptType];")
        )
    )

    const outputPath = join(
        import.meta.dir,
        "../src/domain/types/enum/dept-type.ts"
    );

    Bun.write(outputPath, output);

    console.log(`Generated ${unique.length} dept types.`);
}

main();