import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Authprovider from './component/Authprovider.tsx';
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

// HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql', // Your GraphQL server URI
});

// Apollo Client
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
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
