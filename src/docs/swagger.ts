import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Rick and Morty GraphQL API',
    version: '1.0.0',
    description: 'Documentación Swagger para la API de Rick and Morty (GraphQL)',
  },
  servers: [
    {
      url: process.env.SWAGGER_URL ?? 'http://localhost:3000',
      description: 'Servidor documentation',
    },
      
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/docs/swagger.yaml'], // puedes usar un archivo YAML separado
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}