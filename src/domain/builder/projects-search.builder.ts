import { DomainError } from "../errors";
import { DefaultsFactory } from "../factory/defaults.factory";
import { IrToDtoMapper } from "../mapper/ir-to-dto.mapper";
import { Field } from "../types/field";
import { NameCriteriaIrBuilder } from "./name-criteria-ir.builder";
import {
    SortOrder,
    type ProjectsSearchRequest
} from "../types/request"
import type { NameCriteriaIrAnyBuilder, NameCriteriaIrStructuredBuilder } from "./name-criteria-ir.builder";
import type { OrgNameIr } from "../types/ir";
import type { OrgNamedIrBuilder, OrgNameIrBuilder } from "./org-name-ir.builder";

export class ProjectsSearchBuilder {
    private request: ProjectsSearchRequest;

    constructor() {
        this.request = DefaultsFactory.createDefaultProjectsSearchRequest()
    }

    /**
     * Get the search request object
     * @returns request object
     */
    build(): ProjectsSearchRequest {
        return this.request;
    }

    /**
     * Order search results based on how closely they match your specified search criteria (relevance)
     * @param sortByRelevance true/false
     */
    sortByRelevance(sortByRelevance: boolean): this {
        this.request.criteria.use_relevance = sortByRelevance;
        return this;
    }

    /**
     * Order search results in ascending or descending order
     * @param order 
     */
    setOrder(order: SortOrder): this {
        this.request.sort_order = order;
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
        this.request.limit = limit;
        return this;
    }

    /**
     * Include these fields in the results. If null then all fields are included by default. If empty, then no fields are included.
     * @param fields - fields to include in results
     */
    includeFields(...fields: Field[]): this {
        const excludedFields = new Set(this.request.exclude_fields ?? []);
        const conflicts = fields.filter(f => excludedFields.has(f));
        if (conflicts.length !== 0) {
            throw new DomainError(
                `Cannot include excluded fields:\n${this.formatList(conflicts)}` +
                `Remove them from includeFields or excludeFields`
            )
        }

        this.request.include_fields = fields;
        return this;
    }

    /**
     * Exclude these fields in the results. If null or empty, no fields are excluded.
     * @param fields - fields to exclude from resutls
     */
    excludeFields(...fields: Field[]): this {
        const includedFields = new Set(this.request.include_fields ?? []);
        const conflicts = fields.filter(f => includedFields.has(f));
        if (conflicts.length !== 0) {
            throw new DomainError(
                `Cannot exclude included fields:\n${this.formatList(conflicts)}\n` +
                `Remove them from includeFields or excludeFields`
            )
        }
        
        this.request.exclude_fields = fields;
        return this;
    }

    /**
     * Filter results by fiscal year appropriation from which project funds were obligated
     * @param years - fiscal years
     */
    fiscalYears(...years: number[]): this {
        const conflicts = years.filter(y => 
            !Number.isInteger(y)
        );
        if (conflicts.length !== 0) {
            throw new DomainError(
                `Cannot filter by fiscal years:\n${this.formatList(conflicts)}\n` +
                `Fiscal years must be integers`
            )
        }

        this.request.criteria.fiscal_years = years;
        return this;
    }

    /**
     * Include active projects (project whose latest Budget End Date has not occurred yet) that match criteria.
     * This expands results and may override filters such as `fiscal_years`
     * @param - true/false
     */
    includeActiveProjects(include: boolean): this {
        this.request.criteria.include_active_projects = include;
        return this;
    }

    /**
     * Filters projects by Principal Investigator (PI) names.
     * 
     * @param names - PI builders
     *
     * Matching semantics:
     * - Fields chained on a single builder are combined with AND (same PI)
     * - Multiple builders are combined with OR (across PIs)
     *
     * See {@link NameCriteriaIrBuilder} for matching modes and constraints.
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
    piNames(...names: (NameCriteriaIrStructuredBuilder | NameCriteriaIrAnyBuilder)[]): this {
        this.request.criteria.pi_names = names.map(n =>
            IrToDtoMapper.toNameCriteria(n.build())
        );
        return this;
    }
    
    /**
     * Filters projects by Project Officer (PO) names.
     * 
     * @param names PO builders
     *
     * Matching semantics:
     * - Fields chained on a single builder are combined with AND (same PI)
     * - Multiple builders are combined with OR (across PIs)
     *
     * See {@link NameCriteriaIrBuilder} for matching modes and constraints.
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
    poNames(...names: (NameCriteriaIrAnyBuilder | NameCriteriaIrAnyBuilder)[]): this {
        this.request.criteria.po_names = names.map(n =>
            IrToDtoMapper.toNameCriteria(n.build())
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
    orgNames(...orgs: OrgNamedIrBuilder[]): this {
        const builtOrgs = orgs.map(o => o.build());
        this.request.criteria.org_names =
            builtOrgs.filter(o => o.kind === "partial").map(o => o.name);
        this.request.criteria.org_names_exact_match =
            builtOrgs.filter(o => o.kind === "exact").map(o => o.name);
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
        const uniqueIds = new Set(ids);
        this.request.criteria.pi_profile_ids = [ ...uniqueIds ];
        return this;
    }

    

    private formatList(fields: (string | number)[]): string {
        return fields.map(f => ` - ${f}`).join("\n");
    }
}
