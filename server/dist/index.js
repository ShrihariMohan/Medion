"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var passport_1 = __importDefault(require("passport"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var googleOAuthRoute_1 = __importDefault(require("./routes/googleOAuthRoute"));
var userRoute_1 = __importDefault(require("./routes/userRoute"));
var draftRoute_1 = __importDefault(require("./routes/draftRoute"));
var authUtil_1 = require("./utils/authUtil");
mongoose_1.default.set("useFindAndModify", false);
var db = mongoose_1.default.connect(process.env.DB_URL || '', { useNewUrlParser: true, useUnifiedTopology: true });
var app = express_1.default();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(cookie_session_1.default({
    name: "session",
    keys: [process.env.KEY1, process.env.KEY2],
    maxAge: 24 * 60 * 60 * 1000,
}));
app.use(function (req, res, next) {
    if (req.headers.origin !== undefined) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, *");
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    if (req.method == "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/auth', googleOAuthRoute_1.default);
app.use('/api/user', authUtil_1.isLoggedIn, userRoute_1.default);
app.use('/api/draft', authUtil_1.isLoggedIn, draftRoute_1.default);
app.listen({ port: 3000 }, function () { return console.log('server started'); });
