import { Router } from "express";

const router = Router();

const keys = [
  {
    key: "KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH",
    name: "My customers first Api Key",
    customMetaData: {},
    customAccountId: "acc-id",
    customUserId: null,
    env: "live",
    createdAt: "2022-03-16T10:34:23.353Z",
    updatedAt: "2022-03-16T10:34:23.353Z",
    isActive: true,
  },
  {
    key: "live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL",
    name: "my-first-api-key",
    customMetaData: {},
    customAccountId: null,
    customUserId: "USR123",
    env: "live",
    createdAt: "2022-04-03T01:59:32.051Z",
    updatedAt: "2022-04-03T01:59:32.051Z",
    isActive: true,
  },
  {
    key: "live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM",
    name: "my-second-api-key",
    customMetaData: {},
    customAccountId: null,
    customUserId: "USR123",
    env: "live",
    createdAt: "2022-04-03T02:02:09.730Z",
    updatedAt: "2022-04-03T02:02:09.730Z",
    isActive: false,
  },
];

export const apiKeyRoutes = router
  .get("/:key", (request, response) => {
    const key = request.params.key;
    if (!key) {
      return response.status(400).json({
        message: "missing api-key",
      });
    }
    if (key === "invalid-key") {
      return response.status(404).json({
        statusCode: 404,
        message: "Invalid client key",
        error: "Not Found",
      });
    }
    // generate 403: user trying to access a key which they don't have access to
    if (key === "$") {
      return response.status(403).json({
        message: "Invalid roles for this account",
      });
    }
    return response.json(keys[0]);
  })
  .get("/", (request, response) => {
    const { projectId, isActive, customAccountId, customUserId } =
      request.query;

    if (!projectId) {
      return response.status(400).json({
        message: "missing project-id",
      });
    }
    const filtered = keys.filter((key) => {
      if (isActive && key.isActive !== (isActive === "true" ? true : false)) {
        return false;
      }
      if (
        customUserId &&
        key.customUserId !== (customUserId === "null" ? null : customUserId)
      ) {
        return false;
      }
      if (
        customAccountId &&
        key.customAccountId !==
          (customAccountId === "null" ? null : customAccountId)
      ) {
        return false;
      }
      return true;
    });
    return response.json(filtered);
  })
  .post("/", (request, response) => {
    const { name, projectId } = request.body;
    if (!name || !projectId) {
      response.json({
        message: "malformed apikey: missing name or projectId",
      });
    }
    return response.json({
      key: "live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM",
      name,
      projectId,
      customAccountId: null,
      customUserId: null,
      env: "live",
      createdAt: "2022-04-02T21:10:39.648Z",
      updatedAt: "2022-04-02T21:10:39.648Z",
      isActive: true,
    });
  })
  .patch("/:key", (request, response) => {
    const { key } = request.params;
    if (!key) {
      return response.status(400).json({
        message: "missing api-key",
      });
    }
    const { name } = request.body;
    if (!name) {
      return response.status(400).json({
        message: "missing name",
      });
    }
    return response.json({ ...keys[1], name });
  })
  .delete("/:key", (request, response) => {
    const { key } = request.params;
    if (!key) {
      return response.status(400).json({
        message: "missing api-key",
      });
    }
    return response.json(true);
  });
