import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';

import { createServer } from 'http'; // For combining HTTP and WebSocket servers
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import createApolloServer from './graphql';
import { UserService } from './services/user';

async function init() {
  const app = express();
  app.use(cors());


  app.use(express.json());

  const pubsub = new PubSub<Record<string, never>>(); // This matches the default `Record<string, never>` type

    console.log('Creating HTTP server...');

  // Create HTTP Server for Express
  const httpServer = createServer(app);
  console.log('Creating Apollo server and schema...');

  // Apollo Server and Schema
  const { gqlServer, schema } = await createApolloServer();
  console.log('Setting up WebSocket server...');

  // WebSocket Server Setup
  const subscriptionServer = SubscriptionServer.create(

    {
      schema,
      execute,
      subscribe,
      onConnect: async (connectionParams: string, webSocket: WebSocket) => {


        console.log('WebSocket connected');
        // You can use connectionParams to pass authentication tokens
        // Perform any initialization logic here
        return { pubsub };
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
    },
    {
      server: httpServer,
      path: '/graphql',
    }
  );
  console.log('WebSocket server setup complete.');

  gqlServer.addPlugin(
    ApolloServerPluginDrainHttpServer({ httpServer })
  );

  gqlServer.addPlugin({

    async serverWillStart() {
      return {

        async drainServer() {

          subscriptionServer.close(); // Gracefully handle WebSocket disconnections
        },
      };
    },
  });
  // Apollo Server Plugins
  console.log('Starting Apollo server...');

  await gqlServer.start();
  console.log('Apollo server started.');

  // Apply Express Middleware
  app.use(
    '/graphql',
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        let user = null;

        try {
          user = await UserService.decodeToken(token);
        } catch (error) {
          console.log('Error decoding token:', error);
        }

        return { user, pubsub };
      },
    })
  );

  // Start the HTTP Server
  httpServer.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
}

init();
