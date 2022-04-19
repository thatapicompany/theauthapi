import { Server } from "http";
import testServer from "../testServer/server";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import ApiResponseError from "../../services/ApiRequest/ApiResponseError";
import ApiRequestError from "../../services/ApiRequest/ApiRequestError";

const port = 4063;

describe("ApiRequest", () => {
  let server: Server;

  beforeAll(() => {
    server = testServer.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  describe("Errors", () => {
    it("should handle request errors", async () => {
      const apiRequest = new ApiRequest({
        host: "http://bad_host:333",
        accessKey: "access_key",
      });
      const action = async () => {
        await apiRequest.request(HttpMethod.GET, "/");
      };
      await expect(action()).rejects.toThrow(ApiRequestError);
    });

    it("should handle response errors", async () => {
      const apiRequest = new ApiRequest({
        host: `http://localhost:${port}`,
        accessKey: "access_key",
      });
      const action = async () => {
        await apiRequest.request(HttpMethod.GET, "/bad-route");
      };
      await expect(action()).rejects.toThrow(ApiResponseError);
    });
  });
});
