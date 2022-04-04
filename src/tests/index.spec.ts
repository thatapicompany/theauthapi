import TheAuthAPI from "../index";
import { Server } from "http";
import testServer from "./testServer/server";
import { response } from "express";

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

describe("ApiKeys", () => {
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
      "live_access_zBA6cvuEbJEUhhDIWwuErXHLnwvWqtcqe2ajfV3RVVZvD6lc6xDUaSsSZL1fk53a"
    );
    expect(data.name).toEqual("My customers first Api Key");
    expect(data.key).toEqual(
      "KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH"
    );
    expect(data.createdAt).toEqual("2022-03-16T10:34:23.353Z");
    expect(data.updatedAt).toEqual("2022-03-16T10:34:23.353Z");
    expect(data.env).toEqual("live");
    expect(data.customAccountId).toEqual("acc-id");
  });
});
