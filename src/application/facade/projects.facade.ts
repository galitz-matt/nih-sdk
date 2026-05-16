import { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder";
import type { ProjectsInput } from "../../domain/types/model/projects-input.model";
import type { ProjectsOutput } from "../../domain/types/model/projects-output.model";
import type { ProjectsClient } from "../../infra/nih/projects.client";
import { ProjectsRequestFactory } from "../factory/project-request.factory";
import type { ProjectsRequest } from "../types/project-request";

export class ProjectsFacade {
    constructor(
        private readonly client: ProjectsClient
    ) {}

    query(): ProjectsRequest {
        const builder = new ProjectsQueryBuilder(); // create new builder instance per query
        return ProjectsRequestFactory.createProjectsQuery(builder, this.client);
    }

    async execute(input: ProjectsInput): Promise<ProjectsOutput> {
        return this.client.search(input);
    }
}