import { join } from "path";
import { BASE_URLS } from "../infra/config";
import type { ApiItemWithChildren } from "./types";
import { toPascalCase } from "./utils";
import { block, line, newline, render, seq } from "@galitz-matt/ts-struct";

async function main() {
	const URL = BASE_URLS.WEBAPP + "/services/Lookup/orgStates"

	const res = await Bun.fetch(URL);
	const raw = await res.json();

	if (!Array.isArray(raw)) {
		throw new Error("Unexpected response: not an array");
	}

	const data: ApiItemWithChildren[] = raw;

	const leaves = data.filter(item => item.children_values === null);

	const entries = leaves.map(item => {
		if (!item.name || !item.value) {
		throw new Error("Unexpected response: item missing name and/or value");
		}

		return {
		key: toPascalCase(item.name),
		value: item.value,
		};
	});

	const unique = Array.from(
		new Map(entries.map(e => [e.key, e])).values()
	).sort((a, b) => a.key.localeCompare(b.key));

	const lines = unique.map(e => `   ${e.key}: "${e.value}",`);

	const output = render(
		seq(
			block(
				"export const OrgState = {",
				unique.map(item =>
					line(`${item.key}: "${item.value}",`)
				),
				"} as const;"
			),
			newline(),
			line("export type OrgState = typeof OrgState[keyof typeof OrgState]")
		)
	);

	const outputPath = join(
		import.meta.dir,
		"../src/domain/types/enum/org-state.ts"
	)
	
	Bun.write(outputPath, output);

	console.log(`Generated ${unique.length} org states/territories.`);
}

main();