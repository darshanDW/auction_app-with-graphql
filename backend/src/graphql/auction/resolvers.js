var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Auction } from "../../services/auctiom";
const queries = {
    Getauctions: (_, payload, context) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(payload);
        const { of } = payload;
        const auctions = yield Auction.getauctions(of, context);
        return { auctions };
    }),
    GetBids: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { auctionId }) {
        console.log(auctionId);
        if (!auctionId) {
            throw new Error("Auction ID is required.");
        }
        const latestBids = yield Auction.getbid(auctionId);
        return latestBids;
    })
};
const mutation = {
    createauction: (_, payload, context) => __awaiter(void 0, void 0, void 0, function* () {
        const auctiom = yield Auction.createAuction(payload, context);
        return auctiom;
    }),
    placeBid: (_, payload, context) => __awaiter(void 0, void 0, void 0, function* () {
        const bids = yield Auction.PlaceBid(payload, context);
        return "place bid";
    })
};
const subscriptions = {
    latestBids: {
        subscribe: (_, { auctionId }, pubsub) => {
            if (!auctionId) {
                throw new Error("Auction ID is required.");
            }
            const x = pubsub.asyncIterableIterator(`LATEST_BIDS_${auctionId}`);
            console.log(x);
            // Now using asyncIterator
            return x;
        },
    },
};
export const resolvers = { queries, mutation, subscriptions };
