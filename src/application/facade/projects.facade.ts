import { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder";
import type { ProjectsInput } from "../../domain/types/model/projects-input.model";
import type { ProjectsOutput } from "../../domain/types/model/projects-output.model";
import type { ProjectsClient } from "../../infra/nih/projects.client";
import type { Executable } from "../types/executable";

export class ProjectsFacade {
    constructor(
        private readonly client: ProjectsClient
    ) {}

    query(): ProjectsQueryBuilder & Executable<ProjectsOutput> {
        const builder = new ProjectsQueryBuilder(); // create new builder instance per query
        return Object.assign(builder, {
            execute: async () => await this.client.search(builder.serialize())
        })

    }

    async execute(input: ProjectsInput): Promise<ProjectsOutput> {
        return this.client.search(input);
    }
}