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
exports.revalidationTag = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const constant_1 = require("../config/constant");
const revalidationTag = (tag) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Your Next.js frontend URL
        // The revalidation secret from your environment variables
        if (!constant_1.REVALIDATION_HASH_KEY) {
            console.error("REVALIDATION_HASH_KEY is not defined in environment variables");
            return false;
        }
        const response = yield (0, node_fetch_1.default)(`${constant_1.NEXT_JS_URL}/api/revalidate?key=${constant_1.REVALIDATION_HASH_KEY}&tag=${tag}`, { method: "GET" });
        if (!response.ok) {
            const error = yield response.text();
            console.error(`Error revalidating tag ${tag}:`, error);
            return false;
        }
        const result = yield response.json();
        console.log(`Successfully revalidated tag: ${tag}`, result);
        return true;
    }
    catch (error) {
        console.error(`Failed to revalidate tag ${tag}:`, error);
        return false;
    }
});
exports.revalidationTag = revalidationTag;
