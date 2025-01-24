import { ContextFunction } from "@apollo/server";
import { prismaClient } from "../lib/db";

import { PubSub } from "graphql-subscriptions";
import { User } from "../graphql/user";





export interface cAuction {
  itemName: string; startingPrice:number; endDate: Date,
  imageUrl:string,

  
  
}

export interface Context {
  context: any
}
export interface of {
  of: String
}

export interface GraphQLContext {
  user?: any
  pubsub: PubSub;
}
export interface bid {
  auctionId: string,
  amount: any
}



export class Auction {
  public static async createAuction(payload: cAuction, context: any) {
    const { itemName, startingPrice, endDate,imageUrl } = payload;

    // Extract and validate user ID from context
    const userId: string = context.user?.id;
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    // Ensure required fields are provided
    if (!itemName || !startingPrice || !endDate) {
      throw new Error("Missing required fields: itemName, startingPrice, or endDate.");
    }

    try {
      // Create the auction
      const auction = await prismaClient.auction.create({
        data: {
          itemName,
          startingPrice,
          currentPrice: startingPrice,
          endDate,
          cloudinaryImageLink:imageUrl,
          creatorId: userId, // Associate the auction with the creator
        },
      });
      console.log(auction)

      // Return the created auction
      return auction;
    } catch (error) {
      console.error("Error creating auction:", error);
      throw new Error("Failed to create auction. Please try again later.");
    }
  }

  public static async getauctions(of: String, Context: any) {
    try {
      if (of == "all") {
        const auctions = await prismaClient.auction.findMany()
        return auctions;
      }
      else {
        if (of == "my") {
          const userid: string = Context.user?.id

          const auctions = await prismaClient.auction.findMany({ where: { creatorId: userid } });
          return auctions;
        }
      }
    }
    catch (err: any) {
      console.log(err.message)
      throw new Error("failed to get auctions")
    }
  };


  public static async getbid(auctionId: string) {
    const latestBids = await prismaClient.bid.findMany({

      where: { auctionId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include:{user:true,auction:{ select: { currentPrice: true, endDate: true } } }
    });
console.log(1)
    return latestBids;
  }



  public static async PlaceBid(payload: bid, context: any) {
    try {
      const { user, pubsub } = context;
  
      if (!user) {
        throw new Error("User not authenticated");
      }
  
      const { auctionId, amount } = payload;
      const userId = user.id;
  
      // Use transaction for atomic operations
      const bid = await prismaClient.$transaction(async (prisma) => {
        const createdBid = await prisma.bid.create({
          data: { userId, auctionId, amount },
          include: { user: true, auction: { select: { currentPrice: true } } },
        });
  
        await prisma.auction.update({
          where: { id: auctionId },
          data: { currentPrice: { increment: amount } }, // Atomic increment
        });
  
        return createdBid;
      });
  
      // Publish updated bids
      const latestBids = await this.getbid(auctionId);
      await pubsub.publish(`LATEST_BIDS_${auctionId}`, { latestBids });
  
      return bid;
    } catch (error: any) {
      console.error("Error placing bid:", error.message);
      throw new Error("Failed to place bid");
    }
  }
}