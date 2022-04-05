import ApiRequest from "../../services/ApiRequest/ApiRequest";
import { Project } from "../../types";
import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import { validateString } from "../../util";
import { ProjectsInterface } from "./ProjectsInterface";

class Projects implements ProjectsInterface {
  api: ApiRequest;
  endpoint: string;

  constructor(apiService: ApiRequest) {
    this.api = apiService;
    this.endpoint = "/projects";
  }

  async getProjects(accountId: string): Promise<Project[]> {
    validateString("accountId", accountId);
    return await this.api.request<Project[]>(
      HttpMethod.GET,
      `${this.endpoint}?accountId=${accountId}`
    );
  }

  async getProject(projectId: string): Promise<Project> {
    validateString("projectId", projectId);
    return await this.api.request<Project>(
      HttpMethod.GET,
      `${this.endpoint}/${projectId}`
    );
  }

  async deleteProject(projectId: string): Promise<boolean> {
    validateString("projectId", projectId);
    return await this.api.request<boolean>(
      HttpMethod.DELETE,
      `${this.endpoint}/${projectId}`
    );
  }

  async createProject(name: string, accountId: string): Promise<Project> {
    validateString("name", name);
    validateString("accountId", accountId);
    return await this.api.request<Project>(HttpMethod.POST, this.endpoint, {
      name,
      accountId,
    });
  }
}

export default Projects;
