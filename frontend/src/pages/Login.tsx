import React from 'react'
import { useEffect, useState } from "react";
import { useQuery, OperationVariables } from "@apollo/client";
import { gettoken } from '../graphql/Queries';
import { useContext } from 'react';
import { AuthContext } from '../component/Authprovider';
import { Link, useNavigate } from 'react-router-dom';
interface GetUserTokenVariables {
    email: string;
    password: string;
  }
  
  interface GetUserTokenResponse {
    getUserToken: {
      token: string;
    };
  }


const Login = () => {
  const navigate=useNavigate();
const xstate=useContext(AuthContext);
const {userLogin,setuserLogin}:any=xstate;

useEffect(()=>{
  const token = localStorage.getItem("authToken");
if(token){
  setuserLogin(true);
  // navigate("/register");
  
}
},[userLogin])
 const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [variables, setVariables] = useState<GetUserTokenVariables | null>(null);

  const { error, loading, data } = useQuery<string>(
    gettoken,
    {
      variables: variables || undefined, // Ensure variables are `undefined` if not set
      skip: !variables, // Skip query execution until variables are set
    }
  );

  useEffect(() => {
    if (data) {
      console.log("Token:",data.getUserToken);
        localStorage.setItem("authToken", data.getUserToken.token);
    }
  }, [data]);

  const handleSubmit = () => {
    setVariables({ email, password });
  };


  return (
<>
<div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Get Token</button>

     
    </div>
    <Link to="/register">new account:Register</Link>

</>
  )
}

export default Login