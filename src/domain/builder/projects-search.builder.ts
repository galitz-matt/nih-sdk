import { DefaultsFactory } from "../factory/defaults.factory";
import type { Field } from "../types/field";
import {
    SortOrder,
    type ProjectsSearchRequest
} from "../types/request"

export class ProjectsSearchBuilder {
    private request: ProjectsSearchRequest;

    constructor() {
        this.request = DefaultsFactory.createDefaultProjectsSearchRequest()
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
    setLimit(limit: number): this {
        if (limit <= 0 || limit > 500) {
            throw new RangeError("limit must be a positive number less than or equal to 500");
        }
        this.request.limit = limit;
        return this;
    }
}