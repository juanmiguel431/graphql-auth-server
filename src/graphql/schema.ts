import { GraphQLSchema } from 'graphql';
import RootQuery from './types/RootQuery';
import Mutation from './Mutation';

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
