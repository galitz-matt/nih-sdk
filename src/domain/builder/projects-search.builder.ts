import { DomainError } from "../errors";
import { DefaultsFactory } from "../factory/defaults.factory";
import { Field } from "../types/field";
import {
    SortOrder,
    type ProjectsSearchRequest
} from "../types/request"

export class ProjectsSearchBuilder {
    private request: ProjectsSearchRequest;

    constructor() {
        this.request = DefaultsFactory.createDefaultProjectsSearchRequest()
    }

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

    excludeFields(...fields: Field[]): this {
        const includedFields = new Set(this.request.include_fields ?? []);
        const conflicts = fields.filter(f => includedFields.has(f));
        
        if (conflicts.length !== 0) {
            throw new DomainError(
                `Cannot exclude included fields:\n${this.formatList(conflicts)}` +
                `Remove them from includeFields or excludeFields`
            )
        }
        
        this.request.exclude_fields = fields;
        return this;
    }

    private formatList(fields: string[]): string {
        return fields.map(f => ` - ${f}`).join("\n");
    }
}
