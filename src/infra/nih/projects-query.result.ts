import type { ProjectsOutput } from "../types/model/projects-output.model";

export class ProjectsQueryResult {
    readonly response: ProjectsOutput;
    private defaultIndent = 4;

    constructor(response: ProjectsOutput) {
        this.response = response;
    }

    toTextFile(path: string, indent: number | string = this.defaultIndent): void {
        Bun.write(path, this.toText());
    }

    toText(indent: number | string = this.defaultIndent): string {
        return JSON.stringify(
            this.response,
            null,
            indent
        );
    }
}