import type { CongDist } from "../enum/cong-dist";
import type { DeptType } from "../enum/dept-type";
import type { Field } from "../enum/field";
import type { FiscalYear } from "../enum/fiscal-year";
import type { OrgCountry } from "../enum/org-country";
import type { OrgState } from "../enum/org-state";
import type { OrgType } from "../enum/org-type";
import type { SortOrder } from "../enum/sort-order";
import type { SpendingCategory } from "../enum/spending-category";

export type ProjectsInput = {
    criteria: {
        use_relevance?: boolean;
        fiscal_years?: FiscalYear[];
        include_active_projects?: boolean;
        pi_names?: NameCriteria[];
        po_names?: NameCriteria[];
        org_names?: string[];
        org_names_exact_match?: string[];
        pi_profile_ids?: number[];
        org_cities?: string[];
        org_states?: OrgState[];
        org_countries?: OrgCountry[];
        project_nums?: string[];
        appl_ids?: number[];
        project_num_split?: ProjectNumSplit; // TODO: add builder method, and dto builder
        agencies?: string[]; // TODO: add builder method
        is_agency_admin?: boolean // TODO: add builder method
        is_agency_funding?: boolean; // TODO: add builder method
        activity_codes?: string[]; // TODO: add builder method
        cooperative_agreement_codes?: string[]; // TODO: add builder method
        award_types?: string[]; // TODO: add builder method
        dept_types?: DeptType[]; // TODO: add builder method
        cong_dists?: CongDist[];
        foa?: string[]; // TODO: add builder method
        opportunity_numbers?: string[]; // TODO: add builder method
        spending_categories?: SpendingCategoriesCriteria; 
        project_start_date?: DateRange; // TODO: add builder method
        project_end_date?: DateRange; // TODO: add builder method
        date_added?: DateRange; // TODO: add builder method
        organization_type?: OrgType[]; 
        full_study_sections?: FullStudySection[]; // TODO: add builder method, and dto builder
        award_notice_date?: DateRange; // TODO: add builder method
        award_amount_range?: AmountRange; // TODO: add builder method
        exclude_sub_projects?: boolean; // TODO: add builder method
        multi_pi_only?: boolean; // TODO: add builder method
        newly_added_projects_only?: boolean; // TODO: add builder method
        sub_project_only?: boolean; // TODO: add builder method
        funding_mechanism?: string[]; // TODO: add builder method
        covid_response?: string[]; // TODO: add builder method
        outcomes_only?: boolean; // TODO: add builder method
        arra_type?: string[]; // TODO: add builder method
        advanced_text_search?: AdvancedTextSearch; // TODO: add builder method, and dto builder
        publications_search?: PublicationsSearch; // TODO: add builder method, and dto builder
    };
    include_fields?: Field[];
    exclude_fields?: Field[];
    offset?: number;
    limit?: number;
    sort_field?: string; // TODO: add builder method
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
    values?: SpendingCategory[];
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

