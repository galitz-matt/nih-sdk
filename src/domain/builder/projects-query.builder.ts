import { DomainError } from "../errors";
import { DefaultsFactory } from "../factory/defaults.factory";
import { IrToModelMapper } from "../mapper/ir-to-model.mapper";
import { Field } from "../types/enum/field";
import type { ProjectsInput } from "../types/model/projects-input.model"
import type { OrgNameIrBuilder } from "./org-name-ir.builder";
import { OrgState } from "../types/enum/org-state";
import type { NameCriteriaIrBuilder } from "./name-criteria-ir.builder";
import type { NameCriteriaIr } from "../types/ir/name-criteria.ir";
import type { SortOrder } from "../types/enum/sort-order";
import type { FiscalYear } from "../types/enum/fiscal-year";
import type { OrgType } from "../types/enum/org-type";
import type { OrgCountry } from "../types/enum/org-country";
import type { SpendingCategory } from "../types/enum/spending-category";
import { CongDist } from "../types/enum/cong-dist";
import { ProjectsQueryValidator } from "../validator/projects-query.validator";

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
     * Filter projects by the congressional district in which business office of the grantee organization or contractor is located
     * Must call orgStates() before congDists()
     * orgStates() arguments must contain OrgStates associated with provided CongDists
     * 
     * @param congDists - constitutional districts
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .orgState(OrgState.AL)
     * .congDists(CongDist.AL_02)
     * ```
     * 
     * Filter projects conducted by grantee organizations with business offices located in Alabama's 2nd congressional district
     * 
     */
    congDists(congDist: CongDist, ...congDists: CongDist[]): this {
        this.payload.criteria.cong_dists = [congDist, ...congDists];
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
     * Order search results in ascending or descending order
     * @param order 
     */
    setOrder(order: SortOrder): this {
        this.payload.sort_order = order;
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
     * Include these fields in the results. If null then all fields are included by default. If empty, then no fields are included.
     * @param fields - fields to include in results
     */
    includeFields(field: Field, ...fields: Field[]): this {
        this.payload.include_fields = [field, ...fields];
        return this;
    }

    /**
     * Exclude these fields in the results. If null or empty, no fields are excluded.
     * @param fields - fields to exclude from resutls
     */
    excludeFields(field: Field, ...fields: Field[]): this {
        this.payload.exclude_fields = [field, ...fields];
        return this;
    }

    /**
     * Filter results by fiscal year appropriation from which project funds were obligated
     * 
     * @param values - FiscalYear value or number representing year
    */
    fiscalYears(year: FiscalYear, ...years: FiscalYear[]): this {
        this.payload.criteria.fiscal_years = [year, ...years];
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
     * Filters projects by Organization names
     * 
     * @param orgs - Organization name builders
     * 
     * See {@link OrgNameIrBuilder} for more on constraints 
     * 
     * Example Usage:
     * ```
     * nih.projects.query()
     * .orgNames(
     *   orgName().name("Yale").partial()
     * )
     * ```
     * matches projects conducted by an organization with name contain "Yale"
     * 
     * ```
     * nih.projects.query()
     * .orgNames(
     *   orgName().name("UNIV OF NORTH CAROLINA CHAPEL HILL").exact()
     * )
     * ```
     * matches projects conducted by an organization with exact name "UNIV OF NORTH CAROLINA CHAPEL HILL"
     * 
     * ```
     * orgNames(
     *   orgName().name("Yale")
     * )
     * ```
     * identical behavior as first example, defaults to "partial"
     */
    orgNames(org: OrgNameIrBuilder, ...orgs: OrgNameIrBuilder[]): this {
        const allOrgs = [org, ...orgs];
        const builtOrgs = allOrgs.map(o => o.build());
        this.payload.criteria.org_names =
            builtOrgs.filter(o => o.kind === "partial").map(o => o.name);
        this.payload.criteria.org_names_exact_match =
            builtOrgs.filter(o => o.kind === "exact").map(o => o.name);
        return this;
    }

    /**
     * Filter projects by city in which the business office of the grantee organization or contractor is located.
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
        this.payload.criteria.org_cities = [city, ...cities];
        return this;
    }

    /**
     * Filter projects conducted by organization based in specified states
     * 
     * @param states - US States & Territories (abbreviated)
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
     * Filters projects conducted by organization based in New York state OR New Jersey
     */
    orgStates(state: OrgState, ...states: OrgState[]): this {
        this.payload.criteria.org_states = [state, ...states];
        return this;
    }

    /**
     * Filter projects conducted by organization based in specified countries
     * 
     * @param countries - Countries
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .orgCountries(
     *   OrgCountry.UnitedStates
     * )
     * ```
     * 
     * Filters projects conducted by organization based in the United States
     */
    orgCountries(country: OrgCountry, ...countries: OrgCountry[]): this {
        this.payload.criteria.org_countries = [country, ...countries];
        return this;
    }

    /**
     * Filter projects conducted by specified organization types
     * 
     * @param types - organization types
     * 
     * Example usage:
     * ```
     * nih.projects.query()
     * .orgTypes(
     *   OrgType.SchoolsOfEngineering
     * )
     * ```
     * 
     * Filters projects conducted by schools of engineering
     */
    orgTypes(type: OrgType, ...types: OrgType[]): this {
        this.payload.criteria.organization_type = [type, ...types];
        return this;
    }

    /**
     * Filters projects by Principal Investigator (PI) names.
     * 
     * @param names - PI builders
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
     *   pi().firstName("John"),
     *   pi().lastName("Smith")
     * )
     * ```
     * matches projects with:
     * - a PI with first name containing "John" OR
     * - a PI with last name containing "Smith"
     * 
     * ```
     * piNames(
     *   pi().firstName("John").lastName("Smith")
     * )
     * ```
     * matches projects with a PI with first name containing "John" AND last name containing "Smith"
     */
    piNames(name: NameCriteriaIrBuilder, ...names: NameCriteriaIrBuilder[]): this {
        const allNames = [name, ...names];
        this.payload.criteria.pi_names = allNames.map(n =>
            IrToModelMapper.toNameCriteria(n.build())
        );
        return this;
    }
    
    /**
     * Filters projects by Project Officer (PO) names.
     * 
     * @param names PO builders
     *
     * Matching Behavior:
     * - Fields chained on a single builder are combined with AND (same PI)
     * - Multiple builders are combined with OR (across PIs)
     *
     * See {@link NameCriteriaIrBuilder} for matching modes and constraints.
     * 
     * Example Usage:
     * 
     * ```
     * nih.projects.query()
     * .poNames(
     *   po().firstName("John"),
     *   po().lastName("Smith")
     * )
     * ```
     * 
     * matches projects with:
     * - a PO with first name containing "John" OR
     * - a PO with last name containing "Smith"
     * 
     * ```
     * poNames(
     *   po().firstName("John").lastName("Smith")
     * )
     * ```
     * matches projects with a PO with first name containing "John" AND last name containing "Smith"
     */
    poNames(name: NameCriteriaIrBuilder, ...names: NameCriteriaIrBuilder[]): this {
        const allNames = [name, ...names];
        this.payload.criteria.po_names = allNames.map(n =>
            IrToModelMapper.toNameCriteria(n.build())
        );
        return this;
    }

    /**
     * Filters projects by PI Profile IDs
     * 
     * Each PI in the RePORTER database has a unique identifier that is constant
    from project to project and year to year, but changes may be observed for investigators
    that have had multiple accounts in the past, particularly for those associated with
    contracts or sub-projects.
     * 
     * @param ids - PI Profile IDs
     */
    piProfileIds(id: number, ...ids: number[]): this {
        this.payload.criteria.pi_profile_ids = [id, ...ids];
        return this;
    }

    /**
     * Filter projects by core project number(s)
     * 
     * @param nums - core project number(s), maximum of 1000 values can be passed
     * 
     * This identifier is not specific to any particular year of the project. 
     * It consists of the project activity code, administering IC, and serial number (a concatenation of Activity, Administering_IC, and Serial_Number).
     */
    projectNums(num: string, ...nums: string[]): this {
        this.payload.criteria.project_nums = [num, ...nums];
        return this;
    }

    /**
     * Filter projects by (congressionally mandated) reporting categories
     * Available for fiscal years 2008 and later.
     * 
     * @param input - spending categories and filtering behavior, must include at least one spending category value
     * 
     * If match_all is true, filter behaves like AND on spending category values
     * otherwise, filter behaves like OR on spending category values
     * 
     * match_all is false by default
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
    spendingCategories(input: {
        values: SpendingCategory[];
        matchAll?: boolean;
    }): this {
        if (input.values.length === 0) {
            throw new DomainError("Empty spendingCategories: 'values' cannot be empty");
        }

        this.payload.criteria.spending_categories = {
            values: input.values,
            match_all: input.matchAll ?? false
        }
        return this;
    }
}