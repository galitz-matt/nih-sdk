import { DomainError } from "../errors";
import { DefaultsFactory } from "../factory/defaults.factory";
import { IrToModelMapper } from "../mapper/ir-to-model.mapper";
import { Field } from "../types/enum/field";
import {
    SortOrder,
    type ProjectsInput
} from "../types/model/projects-input.model"
import type { OrgNameIrBuilder } from "./org-name-ir.builder";
import type { OrgState } from "../types/enum/org-state";
import type { NameCriteriaIrBuilder } from "./name-criteria-ir.builder";
import type { NameCriteriaIr } from "../types/ir/name-criteria.ir";

export class ProjectsBuilder {
    private payload: ProjectsInput;

    constructor() {
        this.payload = DefaultsFactory.createDefaultProjectsInput()
    }

    /**
     * Get the search request object
     * @returns request object
     */
    build(): ProjectsInput {
        return this.payload;
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
     * @param limit - must be a positive number less than or equal to 500 (default: 50)
     */
    limit(limit: number): this {
        if (limit <= 0 || limit > 500) {
            throw new RangeError("limit must be a positive number less than or equal to 500");
        }
        this.payload.limit = limit;
        return this;
    }

    /**
     * Include these fields in the results. If null then all fields are included by default. If empty, then no fields are included.
     * @param fields - fields to include in results
     */
    includeFields(...fields: Field[]): this {
        const excludedFields = new Set(this.payload.exclude_fields ?? []);
        const conflicts = fields.filter(f => excludedFields.has(f));
        if (conflicts.length !== 0) {
            throw new DomainError(
                `Cannot include excluded fields:\n${this.formatList(conflicts)}` +
                `Remove them from includeFields or excludeFields`
            )
        }

        this.payload.include_fields = fields;
        return this;
    }

    /**
     * Exclude these fields in the results. If null or empty, no fields are excluded.
     * @param fields - fields to exclude from resutls
     */
    excludeFields(...fields: Field[]): this {
        const includedFields = new Set(this.payload.include_fields ?? []);
        const conflicts = fields.filter(f => includedFields.has(f));
        if (conflicts.length !== 0) {
            throw new DomainError(
                `Cannot exclude included fields:\n${this.formatList(conflicts)}\n` +
                `Remove them from includeFields or excludeFields`
            )
        }
        
        this.payload.exclude_fields = fields;
        return this;
    }

    /**
     * Filter results by fiscal year appropriation from which project funds were obligated
     * 
     * @param values - FiscalYear value or number representing year
     */
    fiscalYears(): this {
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
     * piNames(
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
    piNames(...names: NameCriteriaIrBuilder[]): this {
        this.payload.criteria.pi_names = names.map(n =>
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
     * See {@link NameCriteriaIrBuilderO} for matching modes and constraints.
     * 
     * Example Usage:
     * 
     * ```
     * poNames(
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
    poNames(...names: NameCriteriaIrBuilder[]): this {
        this.payload.criteria.po_names = names.map(n =>
            IrToModelMapper.toNameCriteria(n.build())
        );
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
     * orgNames(
     *   orgName().name("Yale").partial()
     * )
     * ```
     * matches projects conducted by an organization with name contain "Yale"
     * 
     * ```
     * orgNames(
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
    orgNames(...orgs: OrgNameIrBuilder[]): this {
        const builtOrgs = orgs.map(o => o.build());
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
     * orgCities(
     *   "New York",
     *   "Vegas"
     * )
     * ```
     * matches projects conducted by organization based in cities whose names contain "New York" OR "Vegas"
     */
    orgCities(...cities: string[]): this {
        this.payload.criteria.org_cities = cities;
        return this;
    }

    /**
     * Filter projects conducted by organization based in specified states
     * 
     * @param states - US States (abbreviated
     * 
     * Example Usage:
     * ```
     * orgStates(
     *   State.NewJersey,
     *   "NY"
     * )
     * ```
     * 
     * matches projects conducted by organization based in New York state OR New Jersey
     */
    orgStates(...states: OrgState[]): this {
        this.payload.criteria.org_states = states;
        return this;
    }

    orgCountries(...countries: string[]): this {
        return this;
    }

    /**
     * Filters project by PI Profile IDs
     * 
     * Each PI in the RePORTER database has a unique identifier that is constant
    from project to project and year to year, but changes may be observed for investigators
    that have had multiple accounts in the past, particularly for those associated with
    contracts or sub-projects.
     * 
     * @param ids - PI Profile IDs
     */
    piProfileIds(...ids: number[]): this {
        this.payload.criteria.pi_profile_ids = ids;
        return this;
    }

    private formatList(fields: (string | number)[]): string {
        return fields.map(f => ` - ${f}`).join("\n");
    }

}
