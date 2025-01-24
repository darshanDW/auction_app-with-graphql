"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedef = void 0;
exports.typedef = `
  scalar DateTime
  scalar Date

  type auction {
    id: ID!
    itemName: String
    cloudinaryImageLink: String
    startingPrice: Float
    currentPrice: Float
    endDate: DateTime
    winnerId: String
    creatorId: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type auctions {
    auctions: [auction!]!
  }
   
   type User{
    id:ID
    firstName:String
    lastName:String
email:String
    }
  
  
  
  type Bid {
  id: ID!
  amount: Float!
  bidderId: String!
  auctionId: String!
  createdAt: DateTime!
  auction:auction

  user:User
}

`;
