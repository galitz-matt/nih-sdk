import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";
import { BASE_URLS } from "../infra/config";
import type { ApiItemWithParent } from "./types";
import { toPascalCase } from "./utils";
import { writeFileSync } from "fs"
import { join } from "path"

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/activityCodes"
    
    const res = await fetch(URL);
    const raw = await res.json();

    if (!Array.isArray(raw)) {
        throw new Error("Unexpected response: not an array");
    }

    const data: ApiItemWithParent[] = raw;

    const filtered = data.filter(item => item.parent_value && item.value && item.value.length === 3)

    const allCodes = [...new Set(filtered.map(item => item.value!))];

    const codeGroups = new Map<string, Set<string>>();
    for (const item of filtered) {
        let group = codeGroups.get(item.parent_value!);
        if (!group) {
            group = new Set<string>();
        }

        group.add(item.value!);
        codeGroups.set(item.parent_value as string, group);
    }

    const activityCodeEnum = seq(
        block(
            "export const ActivityCode = {",
            allCodes.map(code => line(`${code}: "${code}",`)),
            "} as const"
        ),
        line("export type ActivityCode = typeof ActivityCode[keyof typeof ActivityCode];")
    )

    const activityCodeGroupEnum = seq(
        block(
            "export const ActivityCodeGroup = {",
            Array.from(codeGroups, ([key, value]) => block(
                toPascalCase(key) + ": [",
                [...value].map(code => line(`"${code}",`)),
                "],"
            )),
            "} as const"
        ),
        line("export type ActivityCodeGroup = typeof ActivityCodeGroup[keyof typeof ActivityCodeGroup];")
    )

    const output = render(seq(
        activityCodeEnum,
        newline(),
        activityCodeGroupEnum
    ));

    const output_path = join(
        import.meta.dir,
        "../src/domain/types/enum/activity-code.ts"
    )

    writeFileSync(output_path, output)

    console.log(`Generated ${allCodes.length} activity codes.`)
}

main();