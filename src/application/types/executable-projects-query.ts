import type { ProjectsQueryBuilder } from "../../domain/builder/projects-query.builder";
import type { ProjectsOutput } from "../../domain/types/model/projects-output.model";
import type { Executable } from "./executable";

export type ExecutableProjectsQuery = ProjectsQueryBuilder & Executable<ProjectsOutput>