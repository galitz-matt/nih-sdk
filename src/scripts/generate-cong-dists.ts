import { OrgState } from "../domain/types/enum/org-state";
import { BASE_URLS } from "../infra/config";
import { join } from "path";
import { writeFileSync } from "fs"
import { line, block, seq, render, newline } from "@galitz-matt/ts-struct";

async function main() {
    const states = Object.values(OrgState)

    let results = new Map<string, string[]>()
    let resultsList: string[] = [];
    for (const [i, s] of states.entries()) {
        const URL = getUrlForState(s);
        const res = await fetch(URL);

        const rateLimitRemaining = res.headers.get("x-rate-limit-remaining")
        if (rateLimitRemaining && Number.parseInt(rateLimitRemaining) < states.length - i) {
            throw new Error("Rate limit has been reached, please wait 1 minute and retry.")
        }

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
                throw new Error("Unexpected response: invalid item shape")
            }
            return item.value;
        })

        const unique = [ ...new Set(data) ].sort()
        results.set(s, unique);
        resultsList = resultsList.concat(unique)
    }

    const output = render(
        seq(
            block(
                "export const CongDist = {",
                resultsList.map(dist => 
                    line(`${dist.toUpperCase().replaceAll("-", "_")}: "${dist}",`)
                ),
                "} as const"
            ),
            line("export type CongDist = typeof CongDist[keyof typeof CongDist]"),
            newline(),
            block(
                "export const CongDistGroup = {",
                results.keys().map(state => {
                    return block(
                        `${state}: [`,
                        results.get(state)!.map(dist => 
                            line(`"${dist}",`)
                        ),
                        "],"
                    )
                }).toArray(),
            "} as const"),
        )
    )

    const OUTPUT_PATH = join(
        import.meta.dir,
        "../src/domain/types/enum/cong-dist.ts"
    );

    writeFileSync(OUTPUT_PATH, output);

    console.log(`Generated ${resultsList.length} congressional district values.`)
}

function getUrlForState(state: string): string {
    return BASE_URLS.WEBAPP + `/services/Lookup/congDists?states=${state}`
}

main()