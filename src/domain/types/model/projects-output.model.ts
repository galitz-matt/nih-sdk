import type { SortOrder } from "../enum/sort-order";

export type ProjectsOutput = {
    meta: Meta;
    results: Project[];
}

type Meta = {
  search_id: string;
  total: number;
  offset: number;
  limit: number;
  sort_field: string | null;
  sort_order: SortOrder;
  sorted_by_relevance: boolean;
  properties: {
    URL: string;
  };
};

type Project = {
  appl_id: number;
  activity_code: string | null;
  fiscal_year: number;
  project_num: string;
  project_serial_num: unknown | null; // TODO: determine this type
  project_num_split: unknown | null; // TODO: determine this type

  project_title: string;
  abstract_text: string;

  project_start_date: string; // ISO
  project_end_date: string;   // ISO

  award_amount: number;

  award_type: string | null;
  award_notice_date: string | null;

  organization: Organization;

  principal_investigators: PrincipalInvestigator[];
  contact_pi_name: string;

  spending_categories: number[] | null;

  terms: string; // encoded "<...><...>"

  project_detail_url: string;

  // conditionally included fields (based on include_fields)
  publications?: unknown[];
  patents?: unknown[];
  clinical_trials?: unknown[];
  study_sections?: unknown[];
};

type Organization = {
  org_name: string;

  // duplicated / inconsistent fields
  city: string | null;
  country: string | null;

  org_city: string;
  org_country: string;
  org_state: string;

  org_state_name: string | null;
  dept_type: string | null;

  fips_country_code: string | null;

  org_duns: string[];
  org_ueis: string[];

  primary_duns: string;
  primary_uei: string;

  org_fips: string;
  org_ipf_code: string;
  org_zipcode: string;

  external_org_id: number;
};

type PrincipalInvestigator = {
  profile_id: number;

  first_name: string;
  middle_name: string;
  last_name: string;

  full_name: string;

  title: string;

  is_contact_pi: boolean;
};