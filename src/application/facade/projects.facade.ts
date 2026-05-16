import { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder";
import type { ProjectsInput } from "../../domain/types/model/projects-input.model";
import type { ProjectsOutput } from "../../domain/types/model/projects-output.model";
import type { ProjectsClient } from "../../infra/nih/projects.client";
import { ExecutableProjectsQueryFactory } from "../factory/executable-projects-query.factory";
import type { ExecutableProjectsQuery } from "../types/executable-projects-query";

export class ProjectsFacade {
    constructor(
        private readonly client: ProjectsClient
    ) {}

    query(): ExecutableProjectsQuery {
        const builder = new ProjectsQueryBuilder(); // create new builder instance per query
        return ExecutableProjectsQueryFactory.createProjectsQuery(builder, this.client);
    }

    async execute(input: ProjectsInput): Promise<ProjectsOutput> {
        return this.client.search(input);
    }
}