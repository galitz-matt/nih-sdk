import type { Field } from "./field";

export type ProjectsSearchRequest = {
    criteria: {
        use_relevance?: boolean;
        fiscal_years?: number[];
        include_active_projects?: boolean;
        pi_names?: NameCriteria[];
        po_names?: NameCriteria[];
        org_names?: string[];
        org_names_exact_match?: string[];
        pi_profile_ids?: number[];
        org_cities?: string[];
        org_states?: string[];
        project_nums?: string[];
        org_countries?: string[];
        appl_ids?: number[];
        project_num_split?: ProjectNumSplit;
        agencies?: string[];
        is_agency_admin?: boolean 
        is_agency_funding?: boolean;
        activity_codes?: string[];
        cooperative_agreement_codes?: string[];
        award_types?: string[];
        dept_types?: string[];
        cong_dsts?: string[];
        foa?: string[];
        opportunity_numbers?: string[];
        spending_categories?: SpendingCategoriesCriteria;
        project_start_date?: DateRange;
        project_end_date?: DateRange;
        date_added?: DateRange;
        organization_type?: string[];
        full_study_sections?: FullStudySection[];
        award_notice_date?: DateRange;
        award_amount_range?: AmountRange;
        exclude_sub_projects?: boolean;
        multi_pi_only?: boolean;
        newly_added_projects_only?: boolean;
        sub_project_only?: boolean;
        funding_mechanism?: string[];
        covid_response?: string[];
        outcomes_only?: boolean;
        arra_type?: string[];
        advanced_text_search?: AdvancedTextSearch;
        publications_search?: PublicationsSearch;
    };
    include_fields?: Field[];
    exclude_fields?: Field[];
    offset?: number;
    limit?: number;
    sort_field?: string;
    sort_order?: SortOrder;
}


export type AdvancedTextSearch = {
    searchText?: string;
    operator?: string;
    search_region?: string;
    search_field?: string;
}

export type AmountRange = {
    min_amount?: number;
    max_amount?: number;
}

export type FullStudySection = {
    irg_code?: string;
    srg_code?: string;
    srg_flex?: string;
    sra_designator_code?: string;
    sra_flex_code?: string;
    group_code?: string;
    name?: string;
    url?: string;
    cmte_id?: number;
    cluster_irg_code?: string;
}

export type DateRange = {
    from_date?: Date;
    to_date?: Date;
}

export type SpendingCategoriesCriteria = {
    values?: number[];
    match_all: boolean
}

export type ProjectNumSplit = {
    appl_type_code?: string;
    activity_code?: string;
    ic_code?: string;
    serial_num?: string;
    support_year?: string;
    full_support_year?: string;
    suffix_code?: string; 
}

export type NameCriteria = {
    any_name?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
}

export type PublicationsSearch = {
    publications_text_search?: string;
    pm_id?: string[];
    pmc_id?: string[];
    appl_id?: number[];
    core_project_nums?: string[];
    get_non_nih_pubs: boolean;
    filter_appl_ids: boolean;
}

export const SortOrder = {
    ASC: "asc",
    DESC: "desc"
} as const;
export type SortOrder = typeof SortOrder[keyof typeof SortOrder]
