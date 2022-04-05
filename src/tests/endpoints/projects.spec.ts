import TheAuthAPI from "../../index";
import testServer from "../testServer/server";
import { Server } from "http";

const port = 4063;

const createClient = (options?: any) => {
  options = Object.assign(
    {
      host: `http://localhost:${port}`,
    },
    options
  );
  return new TheAuthAPI("access_key", options);
};

describe("Projects", () => {
  let server: Server;
  beforeAll(() => {
    server = testServer.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  it("should list all projects", async () => {
    const client = createClient();
    const projects = await client.projects.getProjects("project-id-1");
    expect(projects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          isActive: true,
          createdBy: "user-id-1",
          createdByType: "ACCESS_KEY",
          updatedAt: new Date("2022-04-05T21:42:58.054Z"),
          createdAt: new Date("2022-04-05T21:42:58.054Z"),
          id: "project-id-1",
          name: "My Auth Project",
          accountId: "my-account-id",
          env: "live",
        }),
      ])
    );
  });
});
