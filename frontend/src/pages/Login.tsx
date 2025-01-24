import React from 'react'
import { useEffect, useState } from "react";
import { useQuery, OperationVariables } from "@apollo/client";
import { gettoken } from '../graphql/Queries';
import { useContext } from 'react';
import { AuthContext } from '../component/Authprovider';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'

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
  const navigate = useNavigate();
  const xstate = useContext(AuthContext);
  const { userLogin, setuserLogin }: any = xstate;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setuserLogin(true);
    }
  }, [userLogin])

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [variables, setVariables] = useState<GetUserTokenVariables | null>(null);

  const { error, loading, data } = useQuery<string>(
    gettoken,
    {
      variables: variables || undefined,
      skip: !variables,
    }
  );

  useEffect(() => {
    if (data) {
      console.log("Token:", data);
      localStorage.setItem("authToken", data.getUserToken.token);
    }
  }, [data]);

  const handleSubmit = () => {
    setVariables({ email, password });
    if(data){
      setuserLogin(true)
      navigate("/all_auction")
    }
  };

  return (
    <>
      <div className='container'>
        <h1>Login</h1>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="login-button"
          onClick={handleSubmit}>
          Get Token
        </button>
      </div>
      <Link 
        className="register-link" 
        to="/register">
        New account: Register
      </Link>
    </>
  )
}

export default Login