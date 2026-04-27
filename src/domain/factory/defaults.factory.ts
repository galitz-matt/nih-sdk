import type { ProjectsSearchInput } from "../types/model/projects-search-input.model";

export class DefaultsFactory {
    static createDefaultProjectsSearchInputModel(): ProjectsSearchInput {
        return {
            criteria: {},
            limit: 50,
            offset: 0
        }
    }
}