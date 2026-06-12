import { writeFileSync } from "fs";
import { join } from "path";
import { BASE_URLS } from "../infra/config";
import type { ApiItem } from "./types"
import { safeKey, toPascalCase } from "./utils";
import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";

const URL = BASE_URLS.WEBAPP + "/services/Lookup/orgCountries";

async function main() {
	const res = await fetch(URL);
	const raw = await res.json();

	if (!Array.isArray(raw)) {
		throw new Error("Unexpected response: not an array");
	}
	const data: ApiItem[] = raw.map(item => {
		if (
			typeof item !== "object" ||
			item === null ||
			typeof (item as any).value !== "string"
		) {
			throw new Error("Unexpected resposne: invalid item shape")
		}

		return { value: (item as any).value }
	});

	const entries = data
		.map(item => item.value)
		.filter(Boolean);

	// Deduplicate just in case
	const unique = Array.from(new Set(entries)).sort();

	const output = render(
		seq(
			block(
				"export const OrgCountry = {",
				unique.map(value =>
					line(`${safeKey(toPascalCase(value))}: "${value}",`)
				),
				"} as const;"
			),
			newline(),
			line("export type OrgCountry = typeof OrgCountry[keyof typeof OrgCountry];")
		)
	);

	const outputPath = join(
		import.meta.dir,
		"../src/domain/types/enum/org-country.ts"
	);

	Bun.write(outputPath, output);

	console.log(`Generated ${unique.length} org countries.`);
}

main();