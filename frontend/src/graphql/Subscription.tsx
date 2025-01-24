import { gql } from '@apollo/client';

export const LATEST_BIDS_SUBSCRIPTION = gql`
  subscription LatestBids($auctionId: ID!) {
    latestBids(auctionId: $auctionId) {
      id
      amount
     
     createdAt
     user{
     firstName
     }
     
     auction{
     currentPrice,
     endDate}
      }
  }
`;