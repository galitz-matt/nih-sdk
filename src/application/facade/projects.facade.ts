import { ProjectsBuilder } from "../../domain/builder/projects.builder";
import type { ProjectsInput } from "../../domain/types/model/projects-input.model";
import type { ProjectsOutput } from "../../domain/types/model/projects-output.model";
import type { ProjectsClient } from "../../infra/nih/projects.client";
import { QueryFactory } from "../factory/query.factory";
import type { ProjectQuery } from "../types/project.query";

export class ProjectsFacade {
    constructor(
        private readonly client: ProjectsClient
    ) {
        this.client = client;
    }

    query(): ProjectQuery {
        const builder = new ProjectsBuilder();
        return QueryFactory.createProjectsQuery(builder, this.client);
    }

    async execute(input: ProjectsInput): Promise<ProjectsOutput> {
        return this.client.search(input);
    }
}