import TheAuthAPI from "../index";
import express from "express";
import { Server } from "http";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require("../../package.json").version;

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

describe("index.ts", () => {
  let server: Server;
  beforeAll(() => {
    server = express()
      .get("/api-keys/:key", (req, res) => {
        const key = req.params.key;
        const accessKey = req.header("x-api-key");
        if (!accessKey) {
          return res.status(400).json({
            error: { message: "missing write key" },
          });
        }

        if (!key) {
          return res.status(400).json({
            error: { message: "missing api-key" },
          });
        }

        const ua = req.headers["user-agent"];
        if (ua !== `theauthapi-client-node/${version}`) {
          return res.status(400).json({
            error: { message: "invalid user-agent" },
          });
        }

        return res.json({
          key: "KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH",
          name: "My customers first Api Key",
          customMetaData: {},
          customAccountId: "acc-id",
          env: "live",
          createdAt: "2022-03-16T10:34:23.353Z",
          updatedAt: "2022-03-16T10:34:23.353Z",
        });
      })
      .listen(port);
  });

  afterAll(() => {
    server.close();
  });

  it("should authenticate a valid api-key", async () => {
    const client = createClient();
    const data = await client.authenticateAPIKeyV2("live_access_zBA6cvuEbJEUhhDIWwuErXHLnwvWqtcqe2ajfV3RVVZvD6lc6xDUaSsSZL1fk53a");
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
