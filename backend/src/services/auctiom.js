var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prismaClient } from "../lib/db";
export class Auction {
    static createAuction(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { itemName, startingPrice, endDate, imageUrl } = payload;
            // Extract and validate user ID from context
            const userId = (_a = context.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new Error("User not authenticated.");
            }
            // Ensure required fields are provided
            if (!itemName || !startingPrice || !endDate) {
                throw new Error("Missing required fields: itemName, startingPrice, or endDate.");
            }
            try {
                // Create the auction
                const auction = yield prismaClient.auction.create({
                    data: {
                        itemName,
                        startingPrice,
                        currentPrice: startingPrice,
                        endDate,
                        cloudinaryImageLink: imageUrl,
                        creatorId: userId, // Associate the auction with the creator
                    },
                });
                console.log(auction);
                // Return the created auction
                return auction;
            }
            catch (error) {
                console.error("Error creating auction:", error);
                throw new Error("Failed to create auction. Please try again later.");
            }
        });
    }
    static getauctions(of, Context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (of == "all") {
                    const auctions = yield prismaClient.auction.findMany();
                    return auctions;
                }
                else {
                    if (of == "my") {
                        const userid = (_a = Context.user) === null || _a === void 0 ? void 0 : _a.id;
                        const auctions = yield prismaClient.auction.findMany({ where: { creatorId: userid } });
                        return auctions;
                    }
                }
            }
            catch (err) {
                console.log(err.message);
                throw new Error("failed to get auctions");
            }
        });
    }
    ;
    static getbid(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const latestBids = yield prismaClient.bid.findMany({
                where: { auctionId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: true }
            });
            console.log(1);
            return latestBids;
        });
    }
    static PlaceBid(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, pubsub } = context;
                if (!user) {
                    throw new Error("user not get");
                }
                const { auctionId, amount } = payload;
                const userId = user.id;
                const bid = yield prismaClient.bid.create({
                    data: {
                        userId,
                        auctionId,
                        amount
                    },
                    include: {
                        user: true
                    }
                });
                if (bid) {
                    yield prismaClient.auction.update({ where: {
                            id: auctionId
                        },
                        data: {
                            currentPrice: amount
                        } });
                }
                const latestBids = yield this.getbid(auctionId);
                console.log(latestBids);
                // Publish the event
                pubsub.publish(`LATEST_BIDS_${auctionId}`, { latestBids });
                return bid;
            }
            catch (err) {
                console.log(err.message);
                throw new Error("failed");
            }
        });
    }
    ;
}
