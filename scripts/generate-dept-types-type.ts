import { BASE_URLS } from "../src/infra/config";
import { toPascalCase } from "./utils";
import { join } from "path";
import { writeFileSync } from "fs";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/deptTypes"

async function main() {
    const res = await fetch(URL);
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

    const lines = unique.map(value => {
        const key = toPascalCase(value);
        return `    ${key}: "${value}",`
    });

    const output = `export const DeptType = {
${lines.join("\n")}
} as const;

export type DeptType = typeof DeptType[keyof typeof DeptType];
`;
    const OUTPUT_PATH = join(
        import.meta.dir,
        "../src/domain/types/enum/dept-type.ts"
    );

    writeFileSync(OUTPUT_PATH, output);
}

main();