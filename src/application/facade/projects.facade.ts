import { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder";
import type { ProjectsInput } from "../../infra/types/model/projects-input.model";
import type { ProjectsOutput } from "../../infra/types/model/projects-output.model";
import type { ProjectsClient } from "../../infra/nih/projects.client";
import type { Executable } from "../types/executable";
import type { ProjectsQueryResult } from "../../infra/nih/projects-query.result";

export class ProjectsFacade {
    constructor(
        private readonly client: ProjectsClient
    ) {}

    query(): ProjectsQueryBuilder & Executable<ProjectsQueryResult> {
        const builder = new ProjectsQueryBuilder(); // create new builder instance per query
        const query = builder as ProjectsQueryBuilder & Executable<ProjectsQueryResult>
        query.execute = async () => await this.client.search(builder.serialize())
        return query;
    }

    async execute(input: ProjectsInput): Promise<ProjectsQueryResult> {
        return this.client.search(input);
    }
}