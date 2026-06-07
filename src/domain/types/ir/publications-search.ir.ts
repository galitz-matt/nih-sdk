/**
 * Behavior is inferred from experimentation and may change.
 *
 * All fields are optional, but at least one should be provided
 * for the filter to have any effect.
 */
export type PublicationsSearchIr = {

    /**
     * Free-text search applied to publication metadata.
     *
     * Likely matches against fields such as:
     * - title
     * - abstract
     * - keywords
     *
     * Behavior is similar to a fuzzy or partial match.
     *
     * Example:
     * ```
     * text: "cancer immunotherapy"
     * ```
     * Matches projects with publications related to cancer immunotherapy.
     */
    text?: string;

    /**
     * Filters by PubMed IDs (PMIDs).
     *
     * Matches projects that have publications with the given PubMed identifiers.
     *
     * Example:
     * ```
     * pmIds: [12345678, 87654321]
     * ```
     */
    pmIds?: number[];

    /**
     * Filters by PubMed Central IDs (PMCIDs).
     *
     * Matches projects that have publications indexed in PubMed Central
     * with the given identifiers.
     *
     * Example:
     * ```
     * pmcIds: [3456789]
     * ```
     */
    pmcIds?: number[];

    /**
     * Filters by NIH application IDs associated with publications.
     *
     * These are internal identifiers linking publications to specific
     * NIH-funded project applications.
     *
     * This is a low-level field and may not be useful for most users.
     */
    applicationIds?: number[];

    /**
     * Filters by core project numbers (grant identifiers).
     *
     * Matches publications associated with specific NIH grant numbers.
     *
     * Supports exact matching; wildcard behavior is not guaranteed.
     *
     * Example:
     * ```
     * coreProjectNumbers: ["R01CA123456"]
     * ```
     */
    coreProjectNumbers?: string[];

    /**
     * Whether to include publications not directly funded by NIH.
     *
     * When true:
     * - includes publications that are not linked to NIH funding
     * - broadens the result set
     *
     * When false or omitted:
     * - likely restricts results to NIH-funded publications only
     *
     * Behavior inferred; NIH does not document this flag.
     */
    includeNonNih?: boolean;

    /**
     * Restricts results to the provided application IDs.
     *
     * When true:
     * - publication filtering is constrained to `applicationIds`
     * - acts as a strict filter
     *
     * When false or omitted:
     * - application IDs may be treated as optional or additive
     *
     * Exact semantics are unclear and may depend on backend logic.
     */
    filterApplicationIds?: boolean;
};