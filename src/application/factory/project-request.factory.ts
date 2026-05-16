import type { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder"
import type { ProjectsClient } from "../../infra/nih/projects.client"
import type { ProjectsRequest } from "../types/project-request"

export class ProjectsRequestFactory {
    static createProjectsQuery(
        builder: ProjectsQueryBuilder,
        client: ProjectsClient
    ): ProjectsRequest {
        return Object.assign(builder, {
            async execute() {
                return await client.search(builder.serialize())
            }
        })
    }
}