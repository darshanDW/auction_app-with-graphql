export const mutation = `
createauction(itemName:String!,startingPrice:Float,endDate:Date,imageUrl:String):auction
    placeBid(auctionId: ID!, amount: Float!): String


`;
