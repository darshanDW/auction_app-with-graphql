"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `
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

    

`;
