import { FetchHttpClient } from "../../infra/http/fetch-http.client";
import { ProjectsClient } from "../../infra/nih/projects.client";
import { ProjectsFacade } from "../facade/projects.facade";
import { createNihSdk } from "../factory/sdk.factory";

export class NihSdk {
    public readonly projects: ProjectsFacade

    constructor() {
        const client = new ProjectsClient(new FetchHttpClient());
        this.projects = new ProjectsFacade(client);
    }
}

const nih = createNihSdk();
export default nih;