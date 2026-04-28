import type { ProjectsInput } from "../../domain/types/model/projects-input.model";
import type { ProjectsOutput } from "../../domain/types/model/projects-output.model";
import { BASE_URLS } from "../config";
import type { HttpClient } from "../http/http.client.interface";

export class ProjectsClient {
    constructor(
        private readonly httpClient: HttpClient
    ) {};

    async search(payload: ProjectsInput): Promise<ProjectsOutput> {
        return this.httpClient.post(
            BASE_URLS + "v2/projects/search",
            payload,
            { timeoutMs: 10_000, retries: 2 }
        );
    }
}