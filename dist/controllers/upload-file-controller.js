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
const app_1 = require("firebase/app");
const firebase_config_1 = require("../configs/firebase.config");
const storage_1 = require("firebase/storage");
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//initialize a firebase application
(0, app_1.initializeApp)(firebase_config_1.firebaseConfig);
//initialize cloud storage and get a reference to the service
const storage = (0, storage_1.getStorage)();
//setting up multer as a middleware to grab photo uploads
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/", upload.single("filename"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const dateTime = giveCurrentDateTime();
        const storageRef = (0, storage_1.ref)(storage, `files/${((_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname) + "     " + dateTime}`);
        //Create file metadata including the content type
        const metadata = {
            contentType: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
        };
        //Upload the file in the bucket storage
        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, (_c = req.file) === null || _c === void 0 ? void 0 : _c.buffer, metadata);
        //by using uploadByesResumable we can control the progress of uploading like pause, resume, cancel
        //Grab the public url
        const downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
        console.log("File successfully uploaded.");
        return res.send({
            message: "file uploaded to firebase storage",
            name: (_d = req.file) === null || _d === void 0 ? void 0 : _d.originalname,
            type: (_e = req.file) === null || _e === void 0 ? void 0 : _e.mimetype,
            downloadURL: downloadURL,
        });
    }
    catch (error) {
        console.error(error);
    }
}));
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
};
exports.default = router;
