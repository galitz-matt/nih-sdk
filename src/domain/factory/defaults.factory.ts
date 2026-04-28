import type { ProjectsInput } from "../types/model/projects-input.model";

export class DefaultsFactory {
    static createDefaultProjectsInput(): ProjectsInput {
        return {
            criteria: {},
            limit: 50,
            offset: 0
        }
    }
}