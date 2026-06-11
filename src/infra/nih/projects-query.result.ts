import type { ProjectsOutput } from "../types/model/projects-output.model";

export class ProjectsQueryResult {
    readonly response: ProjectsOutput;

    constructor(response: ProjectsOutput) {
        this.response = response;
    }

    toTextFile(path: string): void {
        Bun.write(path, this.toText());
    }

    toText(): string {
        return JSON.stringify(this.response);
    }
}