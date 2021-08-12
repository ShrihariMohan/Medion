"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Draft = void 0;
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    userId: String,
    content: String,
    title: String,
    createdBy: String,
    preview: String,
    level: { type: String, default: 'free' }
});
exports.Draft = mongoose_1.model('Draft', schema);
