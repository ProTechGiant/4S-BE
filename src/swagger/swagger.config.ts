import SwaggerDefinition from 'swagger-autogen';

const swaggerDefinition: any = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'API documentation for my Express app',
  },
  servers: [
    {
      url: 'http://127.0.0.1:8081', // Replace with your actual server URL
      description: 'Development server',
    },
  ],
};

export default swaggerDefinition;
