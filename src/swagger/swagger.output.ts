/* eslint-disable @typescript-eslint/no-var-requires */
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "4S backend-API",
    description: "Description",
  },
  basePath: "/v1",
  host: "",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/index.ts"]; //'../**/*.routes.ts'

swaggerAutogen(outputFile, endpointsFiles, doc);
