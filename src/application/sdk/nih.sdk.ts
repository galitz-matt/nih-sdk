import { FetchHttpClient } from "../../infra/http/fetch-http.client";
import { RateLimitedHttpClient } from "../../infra/http/rate-limited-http.client";
import { ProjectsClient } from "../../infra/nih/projects.client";
import { ProjectsFacade } from "../facade/projects.facade";
import { createNihSdk } from "../factory/sdk.factory";

export class NihSdk {
    public readonly projects: ProjectsFacade

    constructor() {
        const client = new ProjectsClient(
            new RateLimitedHttpClient(
                new FetchHttpClient(),
                1000
            )
        );
        this.projects = new ProjectsFacade(client);
    }
}

const nih = createNihSdk();
export default nih;