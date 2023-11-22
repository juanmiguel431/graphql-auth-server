import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {}
});

export default Mutation;
