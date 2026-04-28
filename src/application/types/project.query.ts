import type { ProjectsBuilder } from "../../domain/builder/projects.builder";
import type { ProjectsOutput } from "../../domain/types/model/projects-output.model";
import type { Executable } from "./executable";

export type ProjectQuery = ProjectsBuilder & Executable<ProjectsOutput>