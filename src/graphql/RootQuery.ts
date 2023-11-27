import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import UserType from './types/UserType';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    user: {
      type: UserType,
      resolve: (source, args, context, info) => {
        return context.user;
      }
    }
  })
});

export default RootQuery;
