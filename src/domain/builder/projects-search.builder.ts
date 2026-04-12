import { DomainError } from "../errors";
import { DefaultsFactory } from "../factory/defaults.factory";
import { IrToDtoMapper } from "../mapper/ir-to-dto.mapper";
import { Field } from "../types/field";
import type { PiName } from "../types/ir";
import {
    SortOrder,
    type ProjectsSearchRequest
} from "../types/request"
import { PiNameBuilder } from "./pi-name.builder";

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
     * Each provided name is converted into API-compatible criteria.
     * See {@link PiName} for matching behavior and field semantics.
     * 
     * Example usage:
     * 
     * ```
     * nih.projects
     *    .piNames(
     *        pi().firstName("Christopher").lastName("Moltisanti"),
     *        { firstName: "Corrado", middleName: "Junior" },
     *        pi().anyName("Gualtieri")
     *    )
     * ```
     */
    piNames(...names: (PiName | PiNameBuilder)[]): this {
        this.request.criteria.pi_names = names.map(n => {
            n = n instanceof PiNameBuilder
                ? n.build()
                : n;
            return IrToDtoMapper.toNameCriteria(n)
        });
        return this;
    }

    private formatList(fields: (string | number)[]): string {
        return fields.map(f => ` - ${f}`).join("\n");
    }
}
