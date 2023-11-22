import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    hello: {
      type: GraphQLString,
      resolve: (source, args, context, info) => {
        return 'JMPC Root Query';
      }
    }
  })
});

export default RootQuery;
