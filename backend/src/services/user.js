var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;
export class UserService {
    static generateHash(salt, password) {
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        return hashedPassword;
    }
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = payload;
            const salt = randomBytes(32).toString("hex");
            const hashedPassword = this.generateHash(salt, password);
            const storeuser = yield prismaClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    salt,
                },
            });
            console.log(storeuser.id, storeuser.email, JWT_SECRET);
            const token = Jwt.sign({ id: storeuser.id, email: storeuser.email }, JWT_SECRET, { expiresIn: "1h" });
            return { storeuser, token };
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient.user.findUnique({ where: { email } });
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient.user.findUnique({ where: { id } });
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
            const token = Jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "5h" });
            console.log(token);
            return token;
        });
    }
    static decodeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = Jwt.verify(token, JWT_SECRET);
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
