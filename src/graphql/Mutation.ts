import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import UserType from './types/UserType';
import { signup, logout } from '../services/authService';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signUp: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (source, args, context, info) => {
        const { email, password } = args;
        return signup({ email, password, req: context });
      }
    },
    logOut: {
      type: UserType,
      resolve: (source, args, context, info) => {
        return logout(context);
      }
    }
  }
});

export default Mutation;
