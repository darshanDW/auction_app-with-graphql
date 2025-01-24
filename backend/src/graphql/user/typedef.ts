export const typeDefs=`
    type User{
    id:ID
    firstName:String
    lastName:String
email:String
    }

    type newUser{
    storeUser:User
    token:String
    
    }
type Token{
    token:String
    email:String}

    

`
