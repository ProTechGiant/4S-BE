import supertest from "supertest";
import { CommonDTOs } from "../common/dto";
import { RESOURCES_TYPES } from "../common/enums";
import { TestServer } from "../test-server";
import app from "../index";
import { InternalServerErrorException } from "../errors/exceptions";

describe("Site Integration Tests", () => {
  const siteName = "Site Name";
  let baseRoute = "/v1/data-models/";
  let request: supertest.SuperTest<supertest.Test>;
  let testServer: TestServer;
  let authToken: string;

  beforeAll(async () => {
    testServer = new TestServer();
    await testServer.setup();
    authToken = testServer.authToken;
    if (!testServer.isRunning()) throw new InternalServerErrorException("Test server failed to start");
    request = supertest(app);
  });

  afterAll(async () => {
    await testServer.teardown();
  });

  it("should create Site", async () => {
    const siteInput: Partial<CommonDTOs.DataModelInput> = {
      entity: "Site",
      input: JSON.parse(
        JSON.stringify({
          name: siteName,
        })
      ),
    };
    const response = await request
      .post(baseRoute + "/create-record-by-json-query")
      .set("Authorization", `Bearer ${authToken}`)
      .send(siteInput);

    const createdPersonnel = response.body;
    expect(createdPersonnel).toBeDefined();
    expect(createdPersonnel.name).toBe(siteName);
  });
});
