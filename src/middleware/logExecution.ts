import { IMiddleware } from 'graphql-middleware';
import { GraphQLResolveInfo } from 'graphql';

const logExecutionMiddleware: IMiddleware = {
  Query: async (resolve, parent, args, context, info: GraphQLResolveInfo) => {

    const operationName = info.operation.name?.value ?? 'Unnamed operation';
    const fieldName = info.fieldName;

    console.log(`[START] Operation: ${operationName}, Field: ${fieldName}`);
    console.log(`Arguments:`, args);
    console.log(`Contexto:`, context);

    const result = await resolve(parent, args, context, info);


    return result;
  },
};

export default logExecutionMiddleware;

