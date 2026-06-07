import type { Field } from "../enum/field";

export type AdvancedTextSearchIr = 
    /**
     * and - Find projects in which all of the search terms are found.
     * or - Find projects that contain at least one of the search terms entered.
     */
    | {
        kind: "and" | "or";
        terms: string[];
        field: Field;
        region?: string;
    }
    /**
     * Advanced: Boolean search with following operands:
     * and - to search for all terms, ex: breast and cancer
     * or – to search for any term, ex: cancer or tumor
     * not – to exclude a term from search, ex: cancer not tumor
     * double-quoted (" ") – to search for exact phrase, ex: "lung cancer"
     * parenthesis - to group the search terms, ex: (breast and cancer) or tumor
     * You can mix and match multiple operands, for ex:(breast and cancer or "lung cancer") not tumor
     */
    | {
        kind: "expr";
        expr: string;
        field: Field;
        region?: string;
    }