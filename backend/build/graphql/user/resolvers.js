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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const user_1 = require("../../services/user");
const queries = {
    getUserToken: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield user_1.UserService.getUserToken({
            email: payload.email,
            password: payload.password,
        });
        console.log(token);
        return { token: token,
            email: payload.email
        };
    }),
    getCurrentLoggedInUser: (_, parameter, context) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(context);
        if (context && context.user) {
            const id = context.user.id;
            const user = yield user_1.UserService.getUserById(id);
            return user;
        }
        throw new Error('i dont know ');
    })
};
const mutations = {
    createUser: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield user_1.UserService.createUser(payload);
        console.log(res);
        return res;
    }),
};
exports.resolvers = { queries, mutations };
