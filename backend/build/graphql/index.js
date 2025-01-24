"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const schema_1 = require("@graphql-tools/schema");
const user_1 = require("./user");
const auction_1 = require("./auction");
function createApolloserver() {
    return __awaiter(this, void 0, void 0, function* () {
        // Combine type definitions
        const typeDefs = `
    ${user_1.User.typeDefs}
    ${auction_1.Auction.typedef}
    type Query {
      ${user_1.User.queries}
      ${auction_1.Auction.queries}
    }
    type Mutation {
      ${user_1.User.mutation}
      ${auction_1.Auction.mutation}
    }
    type Subscription {
      ${auction_1.Auction.subscriptions}
    }
  `;
        // Combine resolvers
        const resolvers = {
            Query: Object.assign(Object.assign({}, user_1.User.resolvers.queries), auction_1.Auction.resolvers.queries),
            Mutation: Object.assign(Object.assign({}, user_1.User.resolvers.mutations), auction_1.Auction.resolvers.mutation),
            Subscription: Object.assign({}, auction_1.Auction.resolvers.subscriptions),
        };
        // Create an executable schema
        const schema = (0, schema_1.makeExecutableSchema)({
            typeDefs,
            resolvers,
        });
        // Create the Apollo Server instance
        const gqlServer = new server_1.ApolloServer({
            schema,
        });
        return { gqlServer, schema }; // Return the server and schema
    });
}
exports.default = createApolloserver;
