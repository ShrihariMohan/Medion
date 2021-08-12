"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedResolvers = exports.typeDefs = void 0;
var apollo_server_express_1 = require("apollo-server-express");
var deepmerge_1 = __importDefault(require("deepmerge"));
var user_1 = require("./user");
var Query = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Query {\n    _empty: String\n  }\n  type Mutation {\n    _empty: String\n  }\n"], ["\n  type Query {\n    _empty: String\n  }\n  type Mutation {\n    _empty: String\n  }\n"])));
exports.typeDefs = [Query, user_1.typedef];
exports.mergedResolvers = deepmerge_1.default({}, user_1.resolvers);
var templateObject_1;
