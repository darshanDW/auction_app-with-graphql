import exp from "constants"
import { User } from "../user"
import { cAuction } from "../../services/auctiom"
import { Auction } from "../../services/auctiom"
import { Payload } from "@prisma/client/runtime/library"
import { of } from "../../services/auctiom"
import { prismaClient } from "../../lib/db"
import { PubSub } from "graphql-subscriptions"
import { bid } from "../../services/auctiom"
const queries = {



     Getauctions: async (_: any, payload: of, context: any) => {
          console.log(payload)
          const { of } = payload

          const auctions = await Auction.getauctions(of, context);
          return { auctions };


     },



     GetBids: async (_: any, { auctionId }: { auctionId: string }) => {
          console.log(auctionId)
          if (!auctionId) {
               throw new Error("Auction ID is required.");
          }

          const latestBids = await Auction.getbid(auctionId);
          console.log(latestBids)
          return latestBids;
     }

}

const mutation = {
     createauction: async (_: any, payload: cAuction, context: any) => {

          const auctiom = await Auction.createAuction(payload, context)
          return auctiom;
     },

     placeBid: async (_: any, payload: bid, context: any) => {

          const bids = await Auction.PlaceBid(payload, context);
         
          return "place bid";



     }



}

 const subscriptions = {
     latestBids: {
       subscribe: (
         _: unknown,
         { auctionId }: { auctionId: string },
         { pubsub }: { pubsub: PubSub<{ LATEST_BIDS: { auctionId: string } }> }
       ) => {
         if (!auctionId) {
           throw new Error("Auction ID is required.");
         }
   console.log("ADd",auctionId)
         return pubsub.asyncIterableIterator(`LATEST_BIDS_${auctionId}`);
       },
     },
   };

export const resolvers = { queries, mutation, subscriptions }