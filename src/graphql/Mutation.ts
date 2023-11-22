import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: (source, args, context, info) => {
        return 'JMPC Mutation';
      }
    }
  }
});

export default Mutation;
