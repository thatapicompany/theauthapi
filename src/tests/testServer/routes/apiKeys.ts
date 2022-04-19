import { Router } from "express";

const router = Router();

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
        message: "Invalid roles for this account"
      })
    }
    return response.json({
      key: "KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH",
      name: "My customers first Api Key",
      customMetaData: {},
      customAccountId: "acc-id",
      env: "live",
      createdAt: "2022-03-16T10:34:23.353Z",
      updatedAt: "2022-03-16T10:34:23.353Z",
    });
  })
  .get("/", (request, response) => {
    const { projectId } = request.query;
    if (!projectId) {
      return response.status(400).json({
        message: "missing project-id",
      });
    }
    return response.json([
      {
        key: "live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL",
        name: "my-first-api-key",
        customMetaData: {},
        customAccountId: null,
        env: "live",
        createdAt: "2022-04-03T01:59:32.051Z",
        updatedAt: "2022-04-03T01:59:32.051Z",
      },
      {
        key: "live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM",
        name: "my-second-api-key",
        customMetaData: {},
        customAccountId: null,
        env: "live",
        createdAt: "2022-04-03T02:02:09.730Z",
        updatedAt: "2022-04-03T02:02:09.730Z",
      },
    ]);
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
      name: "my-new-api-key1",
      env: "live",
      createdAt: "2022-04-02T21:10:39.648Z",
      updatedAt: "2022-04-02T21:10:39.648Z",
    });
  })
  .patch("/:key", (request, response) => {
    const { key } = request.params;
    if (!key) {
      return response.status(400).json({
        message: "missing api-key",
      });
    }
    return response.json({
      key: "live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ",
      name: "my-first-updated-key",
      env: "live",
      createdAt: "2022-04-02T21:10:39.648Z",
      updatedAt: "2022-04-02T21:10:39.648Z",
    });
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
