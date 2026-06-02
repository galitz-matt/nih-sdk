import { line, render, seq } from "@galitz-matt/ts-struct";
import { BASE_URLS } from "../src/infra/config";
import { join } from "path"

async function main() {
    const URL = BASE_URLS.WEBAPP + "/services/Lookup/awardAmountRange";
    
    const res = await Bun.fetch(URL);
    const raw = await res.json();

    if (typeof raw !== "object" || raw === null) {
        throw new Error("Unexpected response: not an object or is null");
    }

    if (
        !("min_award_amount" in raw) ||
        !("max_award_amount" in raw)
    ) {
        throw new Error("Unexpected response: required props are missing");
    }

    if (
        typeof raw.max_award_amount !== "number" ||
        typeof raw.min_award_amount !== "number"
    ) {
        throw new Error("Unexpected response: invalid values");
    }

    const output = render(seq(
        line(`export const MIN_AWARD_AMOUNT = ${raw.min_award_amount};`),
        line(`export const MAX_AWARD_AMOUNT = ${raw.max_award_amount};`)
    ))

    const output_path = join(
        import.meta.dir,
        "../src/domain/constants/amount-range.ts"
    );

    Bun.write(output_path, output);

    console.log("Generated award amount range.");
}

main();