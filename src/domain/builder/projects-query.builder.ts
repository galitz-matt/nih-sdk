import { DefaultsFactory } from "../factory/defaults.factory";
import { Field } from "../types/enum/field";
import type { FullStudySection, NameCriteria, ProjectNumSplit, ProjectsInput } from "../../infra/types/model/projects-input.model"
import type { OrgNameIrBuilder } from "./org-name-ir.builder";
import { OrgState } from "../types/enum/org-state";
import type { NameCriteriaBuilder } from "./name-criteria.builder";
import type { SortOrder } from "../types/enum/sort-order";
import type { FiscalYear } from "../types/enum/fiscal-year";
import { OrgType } from "../types/enum/org-type";
import { OrgCountry } from "../types/enum/org-country";
import { SpendingCategory } from "../types/enum/spending-category";
import { CongDist } from "../types/enum/cong-dist";
import { ProjectsQueryValidator } from "../validator/projects-query.validator";
import { ActivityCode, ActivityCodeGroup } from "../types/enum/activity-code";
import { Agency } from "../types/enum/agency";
import type { AgencyIr } from "../types/ir/agency.ir";
import { unique, uniqueFlat } from "../utils/unique";
import type { SpendingCategoryIr } from "../types/ir/spending-category.ir";
import type { CoopAgreementCode } from "../types/enum/coop-agreement-code";
import { AwardType } from "../types/enum/award-type";
import { DeptType } from "../types/enum/dept-type";
import { MIN_AWARD_AMOUNT, MAX_AWARD_AMOUNT } from "../constants/amount-range";
import { FundingMechanism } from "../types/enum/funding-mechanism";
import type { OrgNameIr } from "../types/ir/org-name.ir";
import type { CovidResponse } from "../types/enum/covid-response";
import type { ArraType } from "../types/enum/arra-type";

export class ProjectsQueryBuilder {
    private payload: ProjectsInput;

    constructor() {
        this.payload = DefaultsFactory.createDefaultProjectsInput()
    }

    /**
     * Get the search request object
     * @returns request object
     */
    serialize(): ProjectsInput {
        ProjectsQueryValidator.validate(this.payload);
        return this.payload;
    }

    /**
     * Matches projects by associated activity codes, or activity code group
     * 
     * @param code - first (group of) activity code
     * @param codes - rest of (group(s) of) activity code(s)
     * 
     * See {@link ActivityCode} and {@link ActivityCodeGroup} for list of valid arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .activityCodes(ActivityCode.AY2, ActivityCodeGroup.Construction)
     * ```
     */
    activityCodes(code: ActivityCode | ActivityCodeGroup, ...codes: (ActivityCode | ActivityCodeGroup)[]): this {
        this.payload.criteria.activity_codes = uniqueFlat<ActivityCode>(code, ...codes);
        return this;
    }

    /**
     * Matches projects by the agencies respondible for the administering of a research grant, project, or contract
     * 
     * @param input - AgencyIr object
     * 
     * - agencies: list of agency codes, must be non-empty
     * - isAdmin: indicates that provided agencies are managing the grant, defaults to true
     * - isFunding: indicates that provided agencies are funding the project, defaults to false
     * 
     * See {@link Agency} for list of valid agencies
     * 
     * Example Usage:
     * ```
     * nih.projects.query()
     * .agencies({
     *  agencies: Agency.NationalInstitutesOfHealth,
     *  isAdmin: false,
     *  isFunding: true
     * })
     * ```
     */
    agencies(input: AgencyIr): this {
        this.payload.criteria.agencies = unique<Agency>(input.agencies);
        this.payload.criteria.is_agency_admin = input.isAdministering ?? true;
        this.payload.criteria.is_agency_funding = input.isFunding ?? false;
        return this;
    }

    /**
     * Matches projects by their application ID (unique project identifier)
     * 
     * @param id - first application ID
     * @param ids - rest of application IDs
     * 
     * Count of application IDs provided cannot exceed 1000
     * 
     */
    applIds(id: number, ...ids: number[]): this {
        this.payload.criteria.appl_ids = unique<number>([id, ...ids]);
        return this;
    }

    /**
     * Matches projects funded, entirely or in part, with provided funds appropriated 
     * under the American Recovery and Reinvestment Act of 2009
     * 
     * @param type - first arra type
     * @param types - rest of arra types
     * 
     * Example usage:
     * ```
     * nih.projcects.query()
     * .arraTypes(ArraType.ComparativeEffectivenessResearchArraSetAside)
     * ```
     * Matches projects with comparative effectiveness research 
     */
    arraTypes(type: ArraType, ...types: ArraType[]): this {
        this.payload.criteria.arra_type = uniqueFlat(type, types);
        return this;
    }

    /**
     * Matches projects with award amounts within provided range
     * 
     * @param min - minimum award granted to project
     * @param max - maxmimum award granted to project
     * 
     * See {@link MIN_AWARD_AMOUNT} and {@link MAX_AWARD_AMOUNT} for valid range values
     */
    awardAmountRange(min: number, max: number): this {
        return this;
    }

    /**
     * Matches projects by type of award received
     * 
     * @param type - first award type
     * @param types - rest of award types
     * 
     * See {@link AwardType} for list of valid arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .awardTypes(AwardType.NewApplication, AwardType.ChangeOfInstituteOrDivision)
     * ```
     */
    awardTypes(type: AwardType, ...types: AwardType[]): this {
        this.payload.criteria.award_types = unique<AwardType>([type, ...types]);
        return this;
    }
    
    /**
     * Matches projects by the congressional district in which business office of the grantee organization or contractor is located
     * Must call orgStates() before congDists()
     * orgStates() arguments must contain OrgStates associated with provided CongDists
     * 
     * @param congDist - first constitutional district
     * @param congDists - rest of constitutional districts
     * 
     * See {@link CongDist} for list of valid arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .orgState(OrgState.AL)
     * .congDists(CongDist.AL_02)
     * ```
     * 
     * Matches projects conducted by grantee organizations with business offices located in Alabama's 2nd congressional district
     * 
     */
    congDists(congDist: CongDist, ...congDists: CongDist[]): this {
        this.payload.criteria.cong_dists = unique([congDist, ...congDists]);
        return this;
    }

    /**
     * Matches projects by cooperative agreement codes
     * 
     * @param code - first cooperative agreement code
     * @param codes - rest of cooperative agreement codes
     * 
     * See {@link CoopAgreementCode} for list of valid arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .coopAgreementCodes(CoopAgreementCode.U03, CoopAgreementCode.UE2)
     */
    coopAgreementCodes(code: CoopAgreementCode, ...codes: CoopAgreementCode[]): this {
        this.payload.criteria.cooperative_agreement_codes = unique([code, ...codes]);
        return this;
    }

    /**
     * Matches projects awarded to study COVID-19 and related topics as funded under provided funding codes
     * 
     * @param response - first covid response
     * @param responses - rest of covid responses
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .covidResponse(
     * CovidResponse.NihRegularAppropriationsFundingUsedForCovid19Research,
     * "C3"
     * )
     * ```
     * Matches projects awarded to study COVID-19 under the NIH Regular Appropriations Funding and the CARES Act
     */
    covidResponse(response: CovidResponse, ...responses: CovidResponse[]): this {
        this.payload.criteria.covid_response = uniqueFlat(response, responses);
        return this;
    }

    /**
     * Matches projects by the departmental affiliation of the PI for a project
     * 
     * @param type - first dept type
     * @param types - rest of dept types
     * 
     * See {@link DeptType} for list of valid arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .deptTypes(DeptType.Administration, DeptType.Biochemistry)
     * ```
     */
    deptTypes(type: DeptType, ...types: DeptType[]): this {
        this.payload.criteria.dept_types = uniqueFlat<DeptType>(type, types);
        return this;
    }

    /**
     * Exclude these fields in the results. If null or empty, no fields are excluded.
     * @param fields - fields to exclude from resutls
     * 
     * See {@link Field} for list of valid arguments
     */
    excludeFields(field: Field, ...fields: Field[]): this {
        this.payload.exclude_fields = [field, ...fields];
        return this;
    }

    /**
     * Excludes sub projects from results
     * @param exclude - boolean
     */
    excludeSubProjects(exclude: boolean): this {
        this.payload.criteria.exclude_sub_projects = exclude;
        return this;
    }

    /**
     * Matches results by fiscal year appropriation from which project funds were obligated
     * 
     * @param values - FiscalYear value or number representing year
     * 
     * See {@link FiscalYear} for list of valid arguments
    */
    fiscalYears(year: FiscalYear, ...years: FiscalYear[]): this {
        this.payload.criteria.fiscal_years = [year, ...years];
        return this;
    }

    /*
     * Matches projects with award notice issued on or after the provided date
     * If used with {@link toAwardNoticeDate}, matches projects with award notice issued within from-to date range
     * 
     * @param month - award notice issue date month
     * @param day - award notice issue date day
     * @param year - award notice issue date year 
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .fromAwardNoticeDate(6, 3, 2007)
     * ```
     * Matches projects with award notice issued on or after 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromDateAdded(6, 3, 2007)
     * .toDateAdded(3, 10, 2010)
     * ```
     * Matches projects with award date notice issued within the range 6/3/2007-3/10/2010
     */
    fromAwardNoticeDate(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.award_notice_date = {
            ...this.payload.criteria.award_notice_date,
            from_date: date
        };
        return this;
    }

    /**
     * Matches projects that were added to the RePORTER site on or after the provided date
     * If used with {@link toDateAdded}, matches projects that were added to the RePORTER site within from-to date range
     * 
     * @param month - date added month
     * @param day - date added day
     * @param year - date added year 
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .fromDateAdded(6, 3, 2007)
     * ```
     * Matches projects added on or after 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromDateAdded(6, 3, 2007)
     * .toDateAdded(3, 10, 2010)
     * ```
     * Matches projects added within the range 6/3/2007-3/10/2010
     */
    fromDateAdded(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.date_added = {
            ...this.payload.criteria.date_added,
            from_date: date
        };
        return this;
    }

    /**
     * Matches projects ending on or after the provided date
     * If used with {@link toEndDate}, matches projects with end dates within from-to date range
     * 
     * @param month - project end date month
     * @param day - project end date day
     * @param year - project end day year
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .fromEndDate(6, 3, 2007)
     * ```
     * Matches projects ending on or after 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromEndDate(6, 3, 2007)
     * .toEndDate(3, 10, 2010)
     * ```
     * Matches projects with end dates within the range, 6/3/2007-3/10/2010
     */
    fromEndDate(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.project_end_date = {
            ...this.payload.criteria.project_end_date,
            from_date: date
        };
        return this;
    }

    /**
     * Matches projects starting on or after the provided date
     * If used with {@link toStartDate}, matches projects with start dates within from-to date range
     * 
     * @param month - project start date month
     * @param day - project start date day
     * @param year - project start day year
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .fromStartDate(6, 3, 2007)
     * ```
     * Matches projects starting on or after 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromStartDate(6, 3, 2007)
     * .toStartDate(3, 10, 2010)
     * ```
     * Matches projects with start dates within the range, 6/3/2007-3/10/2010
     */
    fromStartDate(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.project_start_date = {
            ...this.payload.criteria.project_start_date,
            from_date: date
        };
        return this;
    }

    /**
     * Match projects 
     * 
     * @param sections
     * @returns 
     */
    fullStudySections(...sections: FullStudySection[]): this {
        this.payload.criteria.full_study_sections = sections;
        return this;
    }

    /**
     * Matches projects with provided funding mechanisms
     * 
     * @param mechanism - first funding mechanism
     * @param mechanisms - rest of funding mechanisms
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .fundingMechanisms(FundingMechanism.RAndDContracts)
     * ```
     */
    fundingMechanisms(mechanism: FundingMechanism, ...mechanisms: FundingMechanism[]): this {
        this.payload.criteria.funding_mechanism = uniqueFlat<FundingMechanism>(mechanism, mechanisms);
        return this;
    }

    /**
     * Match projects by their funding opportunity announcement numbers
     * This method has the same filtering behavior as {@link opportunityNumbers}
     * 
     * @param num - first funding opportunity announcement number
     * @param nums - rest of funding opportunity announcement numbers
     */
    fundingOpportunityAnnouncements(num: string, ...nums: string[]): this {
        this.payload.criteria.foa = uniqueFlat<string>(num, nums);
        return this;
    }

    /**
     * Match projects by their grant numbers
     * 
     * @param nums - core project number(s), maximum of 1000 values can be passed
     * 
     * This identifier is not specific to any particular year of the project. 
     * It consists of the project activity code, administering IC, and serial number (a concatenation of Activity, Administering_IC, and Serial_Number).
     * 
     * The wildcard asterik "*" can be used to match zero or more characters.
     * It is not recommended to use the wildcard at the beginning of the text
     */
    grantNumbers(num: string, ...nums: string[]): this {
        this.payload.criteria.project_nums = unique<string>([num, ...nums]);
        return this;
    }

    /**
     * Include active projects in results.
     * An active project is one whose latest Budget End Date has not occurred yet. 
     * The project becomes inactive when the latest Budget End date has past current date.
     * 
     * @param include - true/false
     */
    includeActiveProjects(include: boolean): this {
        this.payload.criteria.include_active_projects = include;
        return this;
    }

    /**
     * Include these fields in the results. If null then all fields are included by default. If empty, then no fields are included.
     * 
     * @param field - first field to include in results
     * @param fields - rest of fields to include in results
     * 
     * See {@link Field} for list of valid arguments
     */
    includeFields(field: Field, ...fields: Field[]): this {
        this.payload.include_fields = [field, ...fields];
        return this;
    }

    /**
     * Set limit the on number of search results returned
     * @param n - must be a positive integer less than or equal to 500 (default: 50)
     */
    limit(n: number): this {
        this.payload.limit = n;
        return this;
    }

    /**
     * Set the starting counter for matching projects. Offset should not exceed total records count.
     * @param n - must be a non-negative integer less than 15000
     */
    offset(n: number): this {
        this.payload.offset = n;
        return this;
    }

    /**
     * Matches projects that are "newly added" to RePORTER site.
     * Please confirm cut-off date here: https://reporter.nih.gov/advanced-search
     * @param flag - if true, results will only include "newly added" projects
     */
    onlyNewlyAdded(flag: boolean): this {
        this.payload.criteria.newly_added_projects_only = flag;
        return this;
    }

    /**
     * Matches projects that are subprojects
     * @param flag - if true, results will only include subprojects
     */
    onlySubProjects(flag: boolean): this {
        this.payload.criteria.sub_project_only = flag;
        return this;
    }

    /**
     * Match projects by the number of their funding opportunity announcement
     * 
     * @param num - first opportunity number
     * @param nums - rest of opportunity numbers
     */
    opportunityNumbers(num: string, ...nums: string[]): this {
        this.payload.criteria.opportunity_numbers = uniqueFlat<string>(num, nums);
        return this;
    }

    /**
     * Match projects by city in which the business office of the grantee organization or contractor is located.
     * 
     * @param cities - Organization cities 
     * 
     * Example Usage:
     * ```
     * nih.projects.query()
     * .orgCities(
     *   "New York",
     *   "Vegas"
     * )
     * ```
     * matches projects conducted by organization based in cities whose names contain "New York" OR "Vegas"
     */
    orgCities(city: string, ...cities: string[]): this {
        this.payload.criteria.org_cities = unique<string>([city, ...cities]);
        return this;
    }

    /**
     * Match projects conducted by organization based in specified countries
     * 
     * @param countries - Countries
     * 
     * See {@link OrgCountry} for list of valid arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .orgCountries(
     *   OrgCountry.UnitedStates
     * )
     * ```
     * 
     * Matches projects conducted by organization based in the United States
     */
    orgCountries(country: OrgCountry, ...countries: OrgCountry[]): this {
        this.payload.criteria.org_countries = unique<OrgCountry>([country, ...countries]);
        return this;
    }

    /**
     * Matches projects by Organization names
     * 
     * @param orgs - Organization name builders
     * 
     * See {@link OrgNameIrBuilder} for more on constraints 
     * 
     * Example Usage:
     * ```
     * nih.projects.query()
     * .orgNames(
     *   orgName().name("Yale").partial().build()
     * )
     * ```
     * matches projects conducted by an organization with name contain "Yale"
     * 
     * ```
     * nih.projects.query()
     * .orgNames(
     *   orgName().name("UNIV OF NORTH CAROLINA CHAPEL HILL").exact().build()
     * )
     * ```
     * matches projects conducted by an organization with exact name "UNIV OF NORTH CAROLINA CHAPEL HILL"
     * 
     * ```
     * orgNames({
     *  kind: "partial"
     *  name: "Yale"
     * })
     * ```
     * identical behavior as first example, defaults to "partial"
     */
    orgNames(org: OrgNameIr, ...orgs: OrgNameIr[]): this {
        const allOrgs = [org, ...orgs];
        this.payload.criteria.org_names =
            allOrgs.filter(o => o.kind === "partial").map(o => o.name);
        this.payload.criteria.org_names_exact_match =
            allOrgs.filter(o => o.kind === "exact").map(o => o.name);
        return this;
    }

    /**
     * Matches projects conducted by organization based in specified states
     * 
     * @param states - US States & Territories (abbreviated)
     * 
     * See {@link OrgState} for list of valid arguments
     * 
     * Example Usage:
     * ```
     * nih.projects.query()
     * .orgStates(
     *   State.NewJersey,
     *   "NY"
     * )
     * ```
     * 
     * Matches projects conducted by organization based in New York state OR New Jersey
     */
    orgStates(state: OrgState, ...states: OrgState[]): this {
        this.payload.criteria.org_states = unique<OrgState>([state, ...states]);
        return this;
    }

    /**
     * Matches projects conducted by specified organization types
     * 
     * @param types - organization types
     * 
     * See {@link OrgType} for list of valid arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .orgTypes(
     *   OrgType.SchoolsOfEngineering
     * )
     * ```
     * 
     * Matches projects conducted by schools of engineering
     */
    orgTypes(type: OrgType, ...types: OrgType[]): this {
        this.payload.criteria.organization_type = unique<OrgType>([type, ...types]);
        return this;
    }

    /**
     * Matches projects by segments of their grant number
     * 
     * @param input - project num split object
     * - appl_type_code: application type code
     * - activity_code: activity code
     * - ic_code: funding institute code
     * - serial_num: 6 digit serial number
     * - support_year: 2 digit support year
     * - full_support_year: 4 digit support year
     * - suffix_code: suffix code
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .partialGrantNumber({
     *  appl_type_code: ApplicationTypeCode.New,
     *  activity_code: "R37",
     *  ic_code: IcCode.NationalEyeInstitute,
     *  serial_num: 123456,
     *  support_year: 20,
     *  full_support_year: 2020,
     *  suffix_code: "A1"
     * })
     * ```
     */
    partialGrantNumber(input: ProjectNumSplit): this {
        this.payload.criteria.project_num_split = input;
        return this;
    }

    /**
     * Matches projects by Principal Investigator (PI) names.
     * 
     * @param names - PIs
     *
     * Matching Behavior:
     * - Fields chained on a single builder are combined with AND (same PI)
     * - Multiple builders are combined with OR (across PIs)
     *
     * See {@link NameCriteriaIr} for matching modes and constraints.
     * 
     * Example Usage:
     * ```
     * nih.projects.query()
     * .piNames(
     *   pi().firstName("John").build(),
     *   pi().lastName("Smith").build()
     * )
     * ```
     * matches projects with:
     * - a PI with first name containing "John" OR
     * - a PI with last name containing "Smith"
     * 
     * ```
     * nih.projects.query()
     * .piNames({
     *  first_name: "John",
     *  last_name: "Smith"
     * })
     * ```
     * matches projects with a PI with first name containing "John" AND last name containing "Smith"
     */
    piNames(name: NameCriteria, ...names: NameCriteria[]): this {
        this.payload.criteria.pi_names = [name, ...names];    
        return this;
    }

    /**
     * Matches projects by PI Profile IDs
     * 
     * Each PI in the RePORTER database has a unique identifier that is constant
    from project to project and year to year, but changes may be observed for investigators
    that have had multiple accounts in the past, particularly for those associated with
    contracts or sub-projects.
     * 
     * @param ids - PI Profile IDs
     */
    piProfileIds(id: number, ...ids: number[]): this {
        this.payload.criteria.pi_profile_ids = unique<number>([id, ...ids]);
        return this;
    }

    /**
     * Matches projects by Project Officer (PO) names.
     * 
     * @param names PO builders
     *
     * Matching Behavior:
     * - Fields chained on a single builder are combined with AND (same PI)
     * - Multiple builders are combined with OR (across PIs)
     *
     * See {@link NameCriteriaBuilder} for matching modes and constraints.
     * 
     * Example Usage:
     * 
     * ```
     * nih.projects.query()
     * .poNames(
     *   po().firstName("John").build(),
     *   po().lastName("Smith").build()
     * )
     * ```
     * 
     * matches projects with:
     * - a PO with first name containing "John" OR
     * - a PO with last name containing "Smith"
     * 
     * ```
     * nih.projects.query()
     * .poNames({
     *  first_name: "John",
     *  last_name: "Smith"
     * })
     * ```
     * matches projects with a PO with first name containing "John" AND last name containing "Smith"
     */
    poNames(name: NameCriteria, ...names: NameCriteria[]): this {
        this.payload.criteria.po_names = [name, ...names];
        return this;
    }

    /**
     * Order search results in ascending or descending order
     * @param order - sorting order
     * 
     */
    setOrder(order: SortOrder): this {
        this.payload.sort_order = order;
        return this;
    }

    /**
     * Order search results based on how closely they match your specified search criteria (relevance)
     * @param sortByRelevance true/false
     */
    sortByRelevance(sortByRelevance: boolean): this {
        this.payload.criteria.use_relevance = sortByRelevance;
        return this;
    }

    /**
     * Sort results by provided field
     * Sorting behavior reflects the data type of the field
     * Numeric fields are sorted least to greatest
     * String fields are sorted alphabetically
     * 
     * This method may cause query to fail resulting in 500 status code, not all fields are supported
     * 
     * @param field - field to sort results by
     */
    sortByField(field: Field): this {
        this.payload.sort_field = field;
        return this;
    }

    /**
     * Matches projects by (congressionally mandated) reporting categories
     * Available for fiscal years 2008 and later.
     * 
     * @param input - spending categories and filtering behavior, must include at least one spending category value
     * - values: spending category values
     * - match_all: if true filter behaves like AND on spending category values otherwise, filter behaves like OR on spending category values. False by default
     * 
     * See {@link SpendingCategory} for list of valid `values` arguments
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .spendingCategories({
     *   values: [SpendingCategory.BackPain, SpendingCategory.Autism]
     *   match_all: true
     * })
     * ```
     * 
     * Query results will consist of projects with ALL spending categories
     */
    spendingCategories(input: SpendingCategoryIr): this {
        this.payload.criteria.spending_categories = {
            values: unique<SpendingCategory>(input.values),
            match_all: input.matchAll ?? false
        }
        return this;
    }

    /*
     * Matches projects with award notice issued on or before the provided date
     * If used with {@link toAwardNoticeDate}, matches projects with award notice issued within from-to date range
     * 
     * @param month - award notice issue date month
     * @param day - award notice issue date day
     * @param year - award notice issue date year 
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .toAwardNoticeDate(6, 3, 2007)
     * ```
     * Matches projects with award notice issued on or before 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromDateAdded(6, 3, 2007)
     * .toDateAdded(3, 10, 2010)
     * ```
     * Matches projects with award date notice issued within the range 6/3/2007-3/10/2010
     */
    toAwardNoticeDate(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.award_notice_date = {
            ...this.payload.criteria.award_notice_date,
            to_date: date
        };
        return this;
    }

    /**
     * Matches projects that were added to the RePORTER site on or before the provided date
     * If used with {@link fromDateAdded}, matches projects that were added to the RePORTER site within from-to date range
     * 
     * @param month - date added month
     * @param day - date added day
     * @param year - date added year 
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .toDateAdded(6, 3, 2007)
     * ```
     * Matches projects added on or before 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromDateAdded(6, 3, 2007)
     * .toDateAdded(3, 10, 2010)
     * ```
     * Matches projects added within the range 6/3/2007-3/10/2010
     */
    toDateAdded(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.date_added = {
            ...this.payload.criteria.date_added,
            to_date: date
        };
        return this;
    }

    /**
     * Matches projects ending on or before the provided date
     * If used with {@link fromEndDate}, matches projects with end dates within from-to date range
     * 
     * @param month - project end date month
     * @param day - project end date day
     * @param year - project end day year
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .toEndDate(6, 3, 2007)
     * ```
     * Matches projects ending on or before 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromEndDate(6, 3, 2007)
     * .toEndDate(3, 10, 2010)
     * ```
     * Matches projects with end dates within the range, 6/3/2007-3/10/2010
     */
    toEndDate(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.project_end_date = {
            ...this.payload.criteria.project_end_date,
            to_date: date
        };
        return this;
    }

    /**
     * Matches projects starting on or before the provided date
     * If used with {@link fromStartDate}, matches projects with start dates within from-to date range
     * 
     * @param month - project start date month
     * @param day - project start date day
     * @param year - project start day year
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .toStartDate(6, 3, 2007)
     * ```
     * Matches projects starting on or before 6/3/2007
     * 
     * ```
     * nih.projects.query()
     * .fromStartDate(6, 3, 2007)
     * .toStartDate(3, 10, 2010)
     * ```
     * Matches projects with start dates within the range, 6/3/2007-3/10/2010
     */
    toStartDate(month: number, day: number, year: number): this {
        const date = this.toDate(month, day, year);
        this.payload.criteria.project_start_date = {
            ...this.payload.criteria.project_start_date,
            to_date: date
        };
        return this;
    }

    /**
     * Excludes projects without outcomes.
     * These projects will either have a Final or Interim Research Performance Progress Report (RPPR) submitted after October 1, 2017. 
     * @param flag - boolean
     */
    withOutcomes(flag: boolean): this {
        this.payload.criteria.outcomes_only = flag;
        return this;
    }

    /**
     * Excludes projects with only one PI
     * @param flag - boolean
     */
    withManyPis(flag: boolean): this {
        this.payload.criteria.multi_pi_only = flag;
        return this;
    }

    private toDate(month: number, day: number, year: number): Date {
        return new Date(`${year}-${month}-${year}`);
    }

}
