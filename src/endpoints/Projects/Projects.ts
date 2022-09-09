import ApiRequest from "../../services/ApiRequest/ApiRequest";
import { CreateProjectInput, Project, UpdateProjectInput } from "../../types";
import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import { ProjectsInterface } from "./ProjectsInterface";

class Projects implements ProjectsInterface {
  api: ApiRequest;
  endpoint: string;

  constructor(apiService: ApiRequest) {
    this.api = apiService;
    this.endpoint = "/projects";
  }

  async getProjects(accountId: string): Promise<Project[]> {
    return await this.api.request<Project[]>(
      HttpMethod.GET,
      `${this.endpoint}?accountId=${accountId}`
    );
  }

  async getProject(projectId: string): Promise<Project> {
    return await this.api.request<Project>(
      HttpMethod.GET,
      `${this.endpoint}/${projectId}`
    );
  }

  async deleteProject(projectId: string): Promise<boolean> {
    return await this.api.request<boolean>(
      HttpMethod.DELETE,
      `${this.endpoint}/${projectId}`
    );
  }

  async createProject(project: CreateProjectInput): Promise<Project> {
    return await this.api.request<Project>(
      HttpMethod.POST,
      this.endpoint,
      project
    );
  }

  async updateProject(
    projectId: string,
    project: UpdateProjectInput
  ): Promise<Project> {
    return this.api.request<Project>(
      HttpMethod.PATCH,
      `${this.endpoint}/${projectId}`,
      project
    );
  }
}

export default Projects;
