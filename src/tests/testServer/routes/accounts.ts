import { Router } from "express";

const router = Router();

const accounts = [
  {
    isActive: true,
    createdBy: "b8264e32-69e7-4980-8afe-19c0559badba",
    createdByType: null,
    createdIn: null,
    lastChangedBy: null,
    lastChangedByType: null,
    updatedAt: "2022-04-06T23:25:16.391Z",
    createdAt: "2022-04-06T23:25:16.391Z",
    id: "bc3be201-f34b-4278-9f19-4e28ebee2561",
    name: "my first auth account",
  },
];

export const accountsRoutes = router
  .get("/", (request, response) => {
    return response.json(accounts);
  })
  .post("/", (request, response) => {
    const { name } = request.body;
    if (!name) {
      return response.json({
        message: "missing account name",
      });
    }
    return response.json({ ...accounts[0], name });
  })
  .get("/:id", (request, response) => {
    const { id } = request.params;
    if (!id) {
      return response.json({
        message: "missing accountId",
      });
    }
    return response.json(accounts.filter((account) => account.id === id)[0]);
  });
