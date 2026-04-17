import type { ProjectsSearchRequest } from "../types/model/request";

export class DefaultsFactory {
    static createDefaultProjectsSearchRequest(): ProjectsSearchRequest {
        return {
            criteria: {},
            limit: 50,
            offset: 0
        }
    }
}