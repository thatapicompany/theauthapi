import TheAuthAPI from "../index";
import { Server } from "http";
import testServer from "./testServer/server";

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

describe("index", () => {
  let server: Server;
  beforeAll(() => {
    server = testServer.listen(port);
  });

  afterAll(() => {
    server.close();
  });
  it("should authenticate a valid key [legacy]", async () => {
    const client = createClient();
    const data: any = await client.authenticateAPIKey(
      "aaa13d30-135e-11ec-8e0f-f1de8e89"
    );
    expect(data.customUserId).toEqual("my-user-id");
    expect(data.customAccountId).toEqual("acc-id");
    expect(data.authenticated).toBeTruthy();
  }, 30000);
});
