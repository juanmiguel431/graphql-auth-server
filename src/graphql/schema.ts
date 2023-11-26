import { GraphQLSchema } from 'graphql';
import RootQuery from './RootQuery';
import Mutation from './Mutation';

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
