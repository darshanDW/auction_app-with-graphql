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
exports.UserService = void 0;
const db_1 = require("../lib/db");
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;
class UserService {
    static generateHash(salt, password) {
        const hashedPassword = (0, node_crypto_1.createHmac)("sha256", salt).update(password).digest("hex");
        return hashedPassword;
    }
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = payload;
            const salt = (0, node_crypto_1.randomBytes)(32).toString("hex");
            const hashedPassword = this.generateHash(salt, password);
            const storeuser = yield db_1.prismaClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    salt,
                },
            });
            console.log(storeuser.id, storeuser.email, JWT_SECRET);
            const token = jsonwebtoken_1.default.sign({ id: storeuser.id, email: storeuser.email }, JWT_SECRET, { expiresIn: "1h" });
            return { storeuser, token };
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.user.findUnique({ where: { email } });
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.prismaClient.user.findUnique({ where: { id } });
            return user;
        });
    }
    static getUserToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            console.log(payload);
            const user = yield UserService.getUserByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            const userSalt = user.salt;
            console.log(user.salt);
            const userHashedPassword = UserService.generateHash(userSalt, password);
            if (userHashedPassword !== user.password) {
                throw new Error("Invalid password");
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "5h" });
            console.log(token);
            return token;
        });
    }
    static decodeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                return decoded;
            }
            catch (err) {
                {
                    console.log(err);
                }
            }
        });
    }
}
exports.UserService = UserService;
