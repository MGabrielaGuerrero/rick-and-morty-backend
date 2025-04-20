import express from 'express';
import './jobs/sync'
import { ApolloServer } from 'apollo-server-express';
import CharacterService from './services/CharacterService';
import LocationService from './services/LocationService';
import EpisodeService from './services/EpisodeService';
import { verifyAuthHeader } from './middleware/auth';
import sequelize from './database';
import schemaWithMiddleware from './graphql/schemaWithMiddleware';



//Documentación Server: 
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./src/docs/swagger.yaml');

const app: any = express();

(async () => {
  try {
    await sequelize.sync();
    console.log('Tablas sincronizadas correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
})();

(async () => {
  try {
    console.log(' 1. Sincronizando Locations...');
    await LocationService.syncLocations();

    console.log(' 2. Sincronizando Episodes...');
    await EpisodeService.syncEpisodes();

    console.log(' 3. Sincronizando Characters...');
    await CharacterService.syncCharacters();

    console.log(new Date().toISOString(), ' Sincronización completada exitosamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
})();


const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req }) => {
    const authHeader = req.headers.authorization;
    const isAuthenticated = verifyAuthHeader(authHeader);
    return { isAuthenticated };
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground()  // Esto habilita Playground
  ],

});

// Configuración de Swagger

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function start() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT ?? 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
  });
}

start();


