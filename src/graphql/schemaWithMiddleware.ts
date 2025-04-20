import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './schema'; // tu archivo de tipo GraphQL
import resolvers from './resolvers';
import logExecutionMiddleware from '../middleware/logExecution';

const baseSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const schemaWithMiddleware = applyMiddleware(
  baseSchema,
  logExecutionMiddleware
);

export default schemaWithMiddleware;
