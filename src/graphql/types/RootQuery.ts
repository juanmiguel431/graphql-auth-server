import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
  })
});

export default RootQuery;
