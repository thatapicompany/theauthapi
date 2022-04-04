import { Router } from "express";

const router = Router();

export const authRoutes = router.post("/authenticate", (request, response) => {
  const { credentials } = request.body;
  if (!credentials || !credentials.api_key) {
    return response.json({
      message: "missing api_key",
    });
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
});
