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
exports.resolvers = void 0;
const auctiom_1 = require("../../services/auctiom");
const queries = {
    Getauctions: (_, payload, context) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(payload);
        const { of } = payload;
        const auctions = yield auctiom_1.Auction.getauctions(of, context);
        return { auctions };
    }),
    GetBids: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { auctionId }) {
        console.log(auctionId);
        if (!auctionId) {
            throw new Error("Auction ID is required.");
        }
        const latestBids = yield auctiom_1.Auction.getbid(auctionId);
        console.log(latestBids);
        return latestBids;
    })
};
const mutation = {
    createauction: (_, payload, context) => __awaiter(void 0, void 0, void 0, function* () {
        const auctiom = yield auctiom_1.Auction.createAuction(payload, context);
        return auctiom;
    }),
    placeBid: (_, payload, context) => __awaiter(void 0, void 0, void 0, function* () {
        const bids = yield auctiom_1.Auction.PlaceBid(payload, context);
        return "place bid";
    })
};
const subscriptions = {
    latestBids: {
        subscribe: (_, { auctionId }, { pubsub }) => {
            if (!auctionId) {
                throw new Error("Auction ID is required.");
            }
            console.log("ADd", auctionId);
            return pubsub.asyncIterableIterator(`LATEST_BIDS_${auctionId}`);
        },
    },
};
exports.resolvers = { queries, mutation, subscriptions };
