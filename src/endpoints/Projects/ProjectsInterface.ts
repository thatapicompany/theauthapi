import { CreateProjectInput, Project, UpdateProjectInput } from "../../types";

export interface ProjectsInterface {
  getProjects(accountId: string): Promise<Project[]>;
  getProject(projectId: string): Promise<Project>;
  deleteProject(projectId: string): Promise<boolean>;
  createProject(project: CreateProjectInput): Promise<Project>;
  updateProject(name: string, updateTo: UpdateProjectInput): Promise<Project>;
}
