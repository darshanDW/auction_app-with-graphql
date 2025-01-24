var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { User } from './user';
import { Auction } from './auction';
function createApolloserver() {
    return __awaiter(this, void 0, void 0, function* () {
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
            Query: Object.assign(Object.assign({}, User.resolvers.queries), Auction.resolvers.queries),
            Mutation: Object.assign(Object.assign({}, User.resolvers.mutations), Auction.resolvers.mutation),
            Subscription: Object.assign({}, Auction.resolvers.subscriptions),
        };
        // Create an executable schema
        const schema = makeExecutableSchema({
            typeDefs,
            resolvers,
        });
        // Create the Apollo Server instance
        const gqlServer = new ApolloServer({
            schema,
        });
        return { gqlServer, schema }; // Return the server and schema
    });
}
export default createApolloserver;
