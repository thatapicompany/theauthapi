import { Project } from "../../types";

export interface ProjectsInterface {
  getProjects(accountId: string): Promise<Project[]>;
  getProject(projectId: string): Promise<Project>;
  deleteProject(projectId: string): Promise<boolean>;
}
