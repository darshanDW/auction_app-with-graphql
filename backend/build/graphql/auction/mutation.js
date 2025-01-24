"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutation = void 0;
exports.mutation = `
createauction(itemName:String!,startingPrice:Float,endDate:Date,imageUrl:String):auction
    placeBid(auctionId: ID!, amount: Float!): String


`;
