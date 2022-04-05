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

  async getProjects(accountId: string) {
    validateString("accountId", accountId);
    return await this.api.request<Project[]>(
      HttpMethod.GET,
      `${this.endpoint}?accountId=${accountId}`
    );
  }
}

export default Projects;
