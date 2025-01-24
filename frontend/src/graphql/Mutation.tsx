import { gql } from "@apollo/client";


export const CreateUser = gql`

mutation createUser($firstName:String!,$lastName:String! ,$email:String!,$password:String!){
createUser(firstName:$firstName,lastName:$lastName,email:$email,password:$password){
  token  }

}
`
export const Createauction = gql`


mutation createauction($itemName:String!,$startingPrice:Float,$endDate:Date,$imageUrl:String){
createauction(itemName:$itemName,startingPrice:$startingPrice,endDate:$endDate,imageUrl:$imageUrl)
{
id
}
}

`


export const PlaceBid=gql`
mutation placeBid($auctionId:ID!,$amount:Float!){

placeBid(auctionId:$auctionId,amount:$amount)



}


`