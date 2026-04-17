export type OrgNameDto = {
	/**
	 * Exact or partial organization name
	 * 
	 * Matching behavior:
	 * - Exact: matches the exact organization name
	 * - Partial: matches a substring of an organization name
	 */
	kind: "exact" | "partial";
	name: string;
}