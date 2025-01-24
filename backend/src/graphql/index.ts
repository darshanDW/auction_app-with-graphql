import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { prismaClient } from '../lib/db';
import { User } from './user';
import { Auction } from './auction';
import { GraphQLContext } from '../services/auctiom';

async function createApolloserver() {
  // Combine type definitions
  const typeDefs = `
    ${User.typeDefs}
    ${Auction.typedef}
    type Query {
      ${User.queries}
      ${Auction.queries}
    }
    type Mutation {
      ${User.mutation}
      ${Auction.mutation}
    }
    type Subscription {
      ${Auction.subscriptions}
    }
  `;

  // Combine resolvers
  const resolvers = {
    Query: {
      ...User.resolvers.queries,
      ...Auction.resolvers.queries,
    },
    Mutation: {
      ...User.resolvers.mutations,
      ...Auction.resolvers.mutation,
    },
    Subscription: {
      ...Auction.resolvers.subscriptions,
    },
  };

  // Create an executable schema
  const schema :any= makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Create the Apollo Server instance
  const gqlServer = new ApolloServer<GraphQLContext>({
    schema,
  });

  return { gqlServer, schema }; // Return the server and schema
}

export default createApolloserver;
