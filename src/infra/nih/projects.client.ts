import type { ProjectsInput } from "../types/model/projects-input.model";
import type { ProjectsOutput } from "../types/model/projects-output.model";
import { BASE_URLS } from "../config";
import type { HttpClient } from "../http/http.client.interface";
import { ProjectsQueryResult } from "./projects-query.result";

export class ProjectsClient {
    constructor(
        private readonly httpClient: HttpClient
    ) {};

    async search(payload: ProjectsInput): Promise<ProjectsQueryResult> {
        const response = await this.httpClient.post<ProjectsOutput>(
            BASE_URLS.API + "/v2/projects/search",
            payload,
            { timeoutMs: 10_000, retries: 2 }
        );

        return new ProjectsQueryResult(response);
    }
}