import { gql } from "@apollo/client";



export const gettoken = gql`

query getUserToken($email:String!,$password:String!){
getUserToken(email:$email,password:$password)
{token}


}

`