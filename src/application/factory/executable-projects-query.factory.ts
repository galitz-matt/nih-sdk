import type { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder"
import type { ProjectsClient } from "../../infra/nih/projects.client"
import type { ExecutableProjectsQuery } from "../types/executable-projects-query"

export class ExecutableProjectsQueryFactory {
    static createProjectsQuery(
        builder: ProjectsQueryBuilder,
        client: ProjectsClient
    ): ExecutableProjectsQuery {
        return Object.assign(builder, {
            async execute() {
                return await client.search(builder.serialize())
            }
        })
    }
}