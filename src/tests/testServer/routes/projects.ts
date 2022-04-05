import { Router } from "express";

const router = Router();

const projects = [
  {
    isActive: true,
    createdBy: "user-id-1",
    createdByType: "ACCESS_KEY",
    createdIn: null,
    lastChangedBy: null,
    lastChangedByType: null,
    updatedAt: "2022-04-05T21:42:58.054Z",
    createdAt: "2022-04-05T21:42:58.054Z",
    id: "project-id-1",
    name: "My Auth Project",
    accountId: "my-account-id",
    env: "live",
  },
  {
    isActive: true,
    createdBy: null,
    createdByType: null,
    createdIn: null,
    lastChangedBy: null,
    lastChangedByType: null,
    updatedAt: "2022-04-02T21:02:14.808Z",
    createdAt: "2022-04-02T21:02:14.808Z",
    id: "project-id-2",
    name: "Hulu",
    accountId: "my-account-id-2",
    env: "live",
  },
];

export const projectRoutes = router
  .get("/", (request, response) => {
    const { accountId } = request.query;
    if (!accountId) {
      return response.json({
        message: "missing accountId",
      });
    }
    return response.json(projects);
  })
  .get("/:id", (request, response) => {
    const { id } = request.params;
    if (!id) {
      return response.json({
        message: "missing projectId",
      });
    }
    return response.json(projects[1]);
  })
  .delete("/:id", (request, response) => {
    const { id } = request.params;
    if (!id) {
      return response.json({
        message: "missing projectId",
      });
    }
    return response.json(true);
  })
  .post("/", (request, response) => {
    const { name, accountId } = request.body;
    if (!accountId || !name) {
      return response.json({
        message: "missing name or accountId",
      });
    }
    return response.json(projects[0]);
  });
