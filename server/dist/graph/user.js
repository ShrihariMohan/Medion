"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typedef = void 0;
var apollo_server_express_1 = require("apollo-server-express");
exports.typedef = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  extend type Query {\n    me: User!\n  }\n\n  type User {\n    id: ID!\n    email: String!\n  }\n"], ["\n  extend type Query {\n    me: User!\n  }\n\n  type User {\n    id: ID!\n    email: String!\n  }\n"])));
exports.resolvers = {
    Query: {
        me: function () { return ({
            id: '123',
            email: 'koushik@wisgloo.com',
        }); },
    },
};
var templateObject_1;
