"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentMode = exports.money = exports.contentListTypes = exports.access = exports.container = void 0;
var container;
(function (container) {
    container["application/pdf"] = "pdf";
    container["video/mp4"] = "videos";
    container["image/png"] = "thumbnails";
    container["audio/mpeg"] = "audio";
})(container = exports.container || (exports.container = {}));
var access;
(function (access) {
    access[access["read"] = 0] = "read";
    access[access["write"] = 1] = "write";
    access[access["list"] = 2] = "list";
})(access = exports.access || (exports.access = {}));
var contentListTypes;
(function (contentListTypes) {
    contentListTypes["purchased"] = "purchased";
    contentListTypes["created"] = "created";
})(contentListTypes = exports.contentListTypes || (exports.contentListTypes = {}));
var money;
(function (money) {
    money["credit"] = "credit";
    money["debit"] = "debit";
})(money = exports.money || (exports.money = {}));
var paymentMode;
(function (paymentMode) {
    paymentMode["wallet"] = "Wallet";
    paymentMode["topUpPayment"] = "Top Up Payment";
})(paymentMode = exports.paymentMode || (exports.paymentMode = {}));
