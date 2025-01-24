"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auction = void 0;
const mutation_1 = require("./mutation");
const queries_1 = require("./queries");
const resolvers_1 = require("./resolvers");
const typedef_1 = require("./typedef");
const Subscription_1 = require("./Subscription ");
exports.Auction = {
    typedef: typedef_1.typedef,
    queries: queries_1.queries,
    mutation: mutation_1.mutation,
    resolvers: resolvers_1.resolvers,
    subscriptions: Subscription_1.subscriptions
};
