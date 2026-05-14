import { OrgState } from "../src/domain/types/enum/org-state";
import { BASE_URLS } from "../src/infra/config";
import { join } from "path";
import { writeFileSync } from "fs"

async function main() {
    const states = Object.values(OrgState)

    let results: string[] = []
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
        results = results.concat(unique);
    }

    const lines = results.map(key => 
        `   ${key.toUpperCase().replace("-", "_")}: "${key}",`
    )

    const output = `export const CongDist = {
${lines.join("\n")}
} as const;
export type CongDist = typeof CongDist[keyof typeof CongDist];`

    const OUTPUT_PATH = join(
        import.meta.dir,
        "../src/domain/types/enum/cong-dist.ts"
    );

    writeFileSync(OUTPUT_PATH, output);

    console.log(`Generated ${results.length} congressional district values.`)
}

function getUrlForState(state: string): string {
    return BASE_URLS.WEBAPP + `/services/Lookup/congDists?states=${state}`
}

main()