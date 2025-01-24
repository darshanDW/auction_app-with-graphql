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
exports.Auction = void 0;
const db_1 = require("../lib/db");
class Auction {
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
                const auction = yield db_1.prismaClient.auction.create({
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
                    const auctions = yield db_1.prismaClient.auction.findMany();
                    return auctions;
                }
                else {
                    if (of == "my") {
                        const userid = (_a = Context.user) === null || _a === void 0 ? void 0 : _a.id;
                        const auctions = yield db_1.prismaClient.auction.findMany({ where: { creatorId: userid } });
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
            const latestBids = yield db_1.prismaClient.bid.findMany({
                where: { auctionId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: true, auction: { select: { currentPrice: true, endDate: true } } }
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
                    throw new Error("User not authenticated");
                }
                const { auctionId, amount } = payload;
                const userId = user.id;
                // Use transaction for atomic operations
                const bid = yield db_1.prismaClient.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    const createdBid = yield prisma.bid.create({
                        data: { userId, auctionId, amount },
                        include: { user: true, auction: { select: { currentPrice: true } } },
                    });
                    yield prisma.auction.update({
                        where: { id: auctionId },
                        data: { currentPrice: { increment: amount } }, // Atomic increment
                    });
                    return createdBid;
                }));
                // Publish updated bids
                const latestBids = yield this.getbid(auctionId);
                yield pubsub.publish(`LATEST_BIDS_${auctionId}`, { latestBids });
                return bid;
            }
            catch (error) {
                console.error("Error placing bid:", error.message);
                throw new Error("Failed to place bid");
            }
        });
    }
}
exports.Auction = Auction;
