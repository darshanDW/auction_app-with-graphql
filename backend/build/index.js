"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
const http_1 = require("http"); // For combining HTTP and WebSocket servers
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const graphql_1 = require("graphql");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const graphql_2 = __importDefault(require("./graphql"));
const user_1 = require("./services/user");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        const pubsub = new graphql_subscriptions_1.PubSub(); // This matches the default `Record<string, never>` type
        console.log('Creating HTTP server...');
        // Create HTTP Server for Express
        const httpServer = (0, http_1.createServer)(app);
        console.log('Creating Apollo server and schema...');
        // Apollo Server and Schema
        const { gqlServer, schema } = yield (0, graphql_2.default)();
        console.log('Setting up WebSocket server...');
        // WebSocket Server Setup
        const subscriptionServer = subscriptions_transport_ws_1.SubscriptionServer.create({
            schema,
            execute: graphql_1.execute,
            subscribe: graphql_1.subscribe,
            onConnect: (connectionParams, webSocket) => __awaiter(this, void 0, void 0, function* () {
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
        gqlServer.addPlugin((0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }));
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
        app.use('/graphql', (0, express4_1.expressMiddleware)(gqlServer, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) {
                const token = req.headers.authorization || '';
                let user = null;
                try {
                    user = yield user_1.UserService.decodeToken(token);
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
