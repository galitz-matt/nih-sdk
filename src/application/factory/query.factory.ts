import type { ProjectsBuilder } from "../../domain/builder/projects.builder"
import type { ProjectsClient } from "../../infra/nih/projects.client"
import type { ProjectQuery } from "../types/project.query"

export class QueryFactory {
    static createProjectsQuery(
        builder: ProjectsBuilder,
        client: ProjectsClient
    ): ProjectQuery {
        return Object.assign(builder, {
            async execute() {
                return client.search(builder.build())
            }
        })
    }
}