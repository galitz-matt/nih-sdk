import type { ProjectsSearchInputModel } from "../types/model/projects-search.model";

export class DefaultsFactory {
    static createDefaultProjectsSearchInputModel(): ProjectsSearchInputModel {
        return {
            criteria: {},
            limit: 50,
            offset: 0
        }
    }
}