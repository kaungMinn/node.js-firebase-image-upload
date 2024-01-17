"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const upload_file_controller_1 = __importDefault(require("./controllers/upload-file-controller"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: false,
}));
app.get("/", (req, res) => {
    res.send("Firebase demo app of node.js-db-demo project!");
});
app.use("/upload", upload_file_controller_1.default);
app.listen(PORT, () => {
    console.log(`Server running on PORT-${PORT}`);
});
