var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http'; // For combining HTTP and WebSocket servers
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import createApolloServer from './graphql';
import { UserService } from './services/user';
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express();
        app.use(cors());
        app.use(express.json());
        const pubsub = new PubSub();
        console.log('Creating HTTP server...');
        // Create HTTP Server for Express
        const httpServer = createServer(app);
        console.log('Creating Apollo server and schema...');
        // Apollo Server and Schema
        const { gqlServer, schema } = yield createApolloServer();
        console.log('Setting up WebSocket server...');
        // WebSocket Server Setup
        const subscriptionServer = SubscriptionServer.create({
            schema,
            execute,
            subscribe,
            onConnect: (connectionParams, webSocket) => __awaiter(this, void 0, void 0, function* () {
                console.log(connectionParams);
                console.log('WebSocket connected');
                // You can use connectionParams to pass authentication tokens
                // Perform any initialization logic here
                return { pubsub };
            }),
            onDisconnect: () => {
                console.log('WebSocket disconnected');
            },
        }, {
            server: httpServer,
            path: '/graphql',
        });
        console.log('WebSocket server setup complete.');
        gqlServer.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer }));
        gqlServer.addPlugin({
            serverWillStart() {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        drainServer() {
                            return __awaiter(this, void 0, void 0, function* () {
                                subscriptionServer.close(); // Gracefully handle WebSocket disconnections
                            });
                        },
                    };
                });
            },
        });
        // Apollo Server Plugins
        console.log('Starting Apollo server...');
        yield gqlServer.start();
        console.log('Apollo server started.');
        // Apply Express Middleware
        app.use('/graphql', expressMiddleware(gqlServer, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) {
                const token = req.headers.authorization || '';
                let user = null;
                try {
                    user = yield UserService.decodeToken(token);
                }
                catch (error) {
                    console.log('Error decoding token:', error);
                }
                return { user, pubsub };
            }),
        }));
        // Start the HTTP Server
        httpServer.listen(3001, () => {
            console.log('Server is running on port 3001');
        });
    });
}
init();
