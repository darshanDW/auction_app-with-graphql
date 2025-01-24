import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Authprovider from './component/Authprovider.tsx';
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import { getMainDefinition } from '@apollo/client/utilities';

import { createClient } from 'graphql-ws';
// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});
const authLink = setContext((_, { headers }) => {
  // Retrieve token from localStorage or other storage mechanism
  const token = localStorage.getItem('authToken'); // Adjust as \

  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

// HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql', // Your GraphQL server URI
});
// Create WebSocket link
const subscriptionClient = new SubscriptionClient(
  'ws://localhost:3001/graphql', // WebSocket endpoint
  {
    reconnect: true, // Reconnect automatically if the connection drops
    connectionParams: {
      authToken: localStorage.getItem('authToken') || null, // Pass token for authentication
    },
  }
);

// Create WebSocketLink using SubscriptionClient
const wsLink = new WebSocketLink(subscriptionClient);
// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,

  from([errorLink, authLink, httpLink])

);

// Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
// For debugging: Add event listeners to the SubscriptionClient
subscriptionClient.onConnected(() => {
  console.log('WebSocket connected');
});

subscriptionClient.onDisconnected(() => {
  console.log('WebSocket disconnected');
});

subscriptionClient.onReconnecting(() => {
  console.log('WebSocket reconnecting...');
});

subscriptionClient.onReconnected(() => {
  console.log('WebSocket reconnected');
});

subscriptionClient.onError((error) => {
  console.error('WebSocket error:', error);
});
// Rendering the application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authprovider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Authprovider>
  </StrictMode>
);
