import type { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder"
import type { ProjectsClient } from "../../infra/nih/projects.client"
import type { ProjectQuery } from "../types/project.query"

export class QueryFactory {
    static createProjectsQuery(
        builder: ProjectsQueryBuilder,
        client: ProjectsClient
    ): ProjectQuery {
        return Object.assign(builder, {
            async execute() {
                return await client.search(builder.serialize())
            }
        })
    }
}