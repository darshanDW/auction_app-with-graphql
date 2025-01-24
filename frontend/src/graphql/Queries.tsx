import { gql } from "@apollo/client";



export const gettoken = gql`

query getUserToken($email:String!,$password:String!){
getUserToken(email:$email,password:$password)
{token}



}
`
export const Getauction = gql`
query Getauctions($of:String){
Getauctions(of:$of)
{
auctions{
id,
itemName,
endDate,
cloudinaryImageLink,
currentPrice,
creatorId
}
}}
`
export const GEtbids = gql`

query GetBids($auctionId:String){
GetBids(auctionId:$auctionId){

id
      amount
     createdAt
     user{
     firstName
     }
     
     auction{
     currentPrice,
     endDate}

}}



`

