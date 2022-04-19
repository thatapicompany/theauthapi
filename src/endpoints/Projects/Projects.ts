import ApiRequest from "../../services/ApiRequest/ApiRequest";
import {
  CreateProjectInput,
  Environment,
  Project,
  UpdateProjectInput,
} from "../../types";
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

  async createProject(project: CreateProjectInput): Promise<Project> {
    this.validateCreateProjectInput(project);
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
    this.validateUpdateProjectInput(projectId, project);
    return this.api.request<Project>(
      HttpMethod.PATCH,
      `${this.endpoint}/${projectId}`,
      project
    );
  }

  private validateCreateProjectInput(project: CreateProjectInput) {
    if (!project) {
      throw new TypeError("project must be an object");
    }
    validateString("name", project.name);
    validateString("accountId", project.accountId);
    if (!Object.values(Environment).includes(project.env)) {
      throw TypeError(
        `expected env to be one of [${Object.values(Environment).map(
          (v) => `"${v}"`
        )}], got: ${project.env}`
      );
    }
  }

  private validateUpdateProjectInput(
    projectId: string,
    project: UpdateProjectInput
  ) {
    if (!project) {
      throw new TypeError("project must be an object");
    }
    validateString("projectId", projectId);
    validateString("name", project.name);
  }
}

export default Projects;
