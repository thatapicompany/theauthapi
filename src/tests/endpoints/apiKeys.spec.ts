import TheAuthAPI from "../../index";
import testServer from "../testServer/server";
import { Server } from "http";
import { shouldThrowError, shouldThrowTypeError } from "../util";
import ApiResponseError from "../../services/ApiRequest/ApiResponseError";

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

  it("should check if an apikey is valid", async () => {
    const client = createClient();
    const valid = await client.apiKeys.isValidKey(
      "live_access_zBA6cvuEbJEUhhDIWwuErXHLnwvWqtcqe2ajfV3RVVZvD6lc6xDUaSsSZL1fk53a"
    );
    const invalid = await client.apiKeys.isValidKey("invalid-key");
    expect(valid).toBeTruthy();
    expect(invalid).toBeFalsy();
    await shouldThrowError(
      () => client.apiKeys.isValidKey("$"),
      ApiResponseError
    );
  });

  it("should get an apikey", async () => {
    const client = createClient();
    const data = await client.apiKeys.getKey(
      "live_access_zBA6cvuEbJEUhhDIWwuErXHLnwvWqtcqe2ajfV3RVVZvD6lc6xDUaSsSZL1fk53a"
    );
    expect(data.name).toEqual("My customers first Api Key");
    expect(data.key).toEqual(
      "KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH"
    );
    expect(data.createdAt).toEqual(new Date("2022-03-16T10:34:23.353Z"));
    expect(data.updatedAt).toEqual(new Date("2022-03-16T10:34:23.353Z"));
    expect(data.env).toEqual("live");
    expect(data.customAccountId).toEqual("acc-id");
  });

  it("should list api keys", async () => {
    const client = createClient();
    const keys = await client.apiKeys.getKeys("project_1");
    expect(keys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL",
          name: "my-first-api-key",
          customMetaData: {},
          customAccountId: null,
          env: "live",
        }),
        expect.objectContaining({
          key: "live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM",
          name: "my-second-api-key",
          customMetaData: {},
          customAccountId: null,
          env: "live",
        }),
      ])
    );
  });

  it("should create a key", async () => {
    const client = createClient();
    const key = await client.apiKeys.createKey({
      name: "my-new-api-key1",
      projectId: "b52262b5-eaa6-4edd-825c-ebcdf76a10e5",
    });
    expect(key).toEqual(
      expect.objectContaining({
        key: "live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM",
        name: "my-new-api-key1",
        env: "live",
      })
    );
  });

  it("should update a key", async () => {
    const client = createClient();
    const key = await client.apiKeys.updateKey(
      "live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ",
      {
        name: "my-first-update-key",
      }
    );
    expect(key.name).toEqual("my-first-updated-key");
    expect(key.key).toEqual(
      "live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ"
    );
  });

  it("should delete a key", async () => {
    const client = createClient();
    const response = await client.apiKeys.deleteKey(
      "live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ"
    );
    expect(response).toBeTruthy();
  });

  it("should validate parameter types", async () => {
    const client = createClient();
    await shouldThrowTypeError(() =>
      client.apiKeys.isValidKey(undefined as any)
    );
    await shouldThrowTypeError(() => client.apiKeys.getKey(undefined as any));
    await shouldThrowTypeError(() => client.apiKeys.getKeys(undefined as any));
    await shouldThrowTypeError(() =>
      client.apiKeys.deleteKey(undefined as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.createKey(undefined as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.createKey({ projectId: "1" } as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.createKey({ name: "a" } as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.createKey({
        name: "a",
        projectId: "1",
        key: undefined,
      } as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.createKey({
        name: "a",
        projectId: "1",
        customAccountId: undefined,
      } as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.createKey({
        name: "a",
        projectId: "1",
        customUserId: undefined,
      } as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.updateKey(undefined as any, {} as any)
    );
    await shouldThrowTypeError(() =>
      client.apiKeys.updateKey(
        undefined as any,
        { name: "a", customAccountId: undefined } as any
      )
    );
  });
});
