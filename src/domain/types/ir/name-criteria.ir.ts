export type NameCriteriaIr = {
    /**
     * Matches any part of a PI's/PO's name.
     *
     * - Tokenized: "John Smith" → ["John", "Smith"]
     * - Substring match: "mit" → matches "Mitchell"
     *
     * Matching behavior:
     * - Tokens may match different PIs/POs within the same project.
     * - This field is evaluated at the project level, not strictly per-PI.
     *
     * Example:
     *  anyName: "John Smith"
     *  → may match a project where:
     *     - one PI/PO has "John" in their name
     *     - another PI/PO has "Smith" in their name
     */
    anyName?: string;

    /**
     * First name of the PI/PO.
     *
     * - Supports partial (prefix/substring) matching.
     *   e.g. "Jo" → matches "John", "Joseph"
     *
     * Matching behavior:
     * - When combined with other structured fields (e.g. lastName),
     *   these are typically evaluated against the same PI/PO.
     * - However, when combined with `anyName`, matches may span
     *   different PIs/POs within the same project.
     */
    firstName?: string;

    /**
     * Last name of the PI/PO.
     *
     * - Supports partial (prefix/substring) matching.
     *   e.g. "Smi" → matches "Smith"
     *
     * Matching behavior:
     * - When combined with other structured fields (e.g. firstName),
     *   these are typically evaluated against the same PI/PO.
     * - When combined with `anyName`, matches may span multiple PIs/POs.
     */
    lastName?: string;

    /**
     * Middle name of the PI/PO.
     *
     * - Typically requires exact or near-exact match (API-dependent).
     *
     * Matching behavior:
     * - Follows the same scoping rules as other structured fields.
     */
    middleName?: string;
};