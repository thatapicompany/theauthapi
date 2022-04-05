import { Project } from "../../types";

export interface ProjectsInterface {
  getProjects(accountId: string): Promise<Project[]>;
}
