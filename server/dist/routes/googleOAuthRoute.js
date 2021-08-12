"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var authUtil_1 = require("../utils/authUtil");
require("../utils/passportSetup");
var router = express_1.default.Router();
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/failed" }), authUtil_1.isLoggedIn, function (req, res) {
    res.redirect(process.env.CLIENT_URL + '/home' || '');
});
router.get("/logout", function (req, res) {
    req.session = null;
    req.logout();
    res.redirect(process.env.CLIENT_URL + "/");
});
router.get("/failed", function (req, res) { return res.send("You Failed to log in!"); });
module.exports = router;
