import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../configs/firebase.config";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import multer from "multer";
import express, { Router } from "express";

const router: Router = express.Router();

//initialize a firebase application
initializeApp(firebaseConfig);

//initialize cloud storage and get a reference to the service
const storage = getStorage();

//setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("filename"), async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `files/${req.file?.originalname + "     " + dateTime}`
    );

    //Create file metadata including the content type
    const metadata = {
      contentType: req.file?.mimetype,
    };

    //Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file?.buffer!,
      metadata
    );

    //by using uploadByesResumable we can control the progress of uploading like pause, resume, cancel

    //Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    return res.send({
      message: "file uploaded to firebase storage",
      name: req.file?.originalname,
      type: req.file?.mimetype,
      downloadURL: downloadURL,
    });
  } catch (error) {
    console.error(error);
  }
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

export default router;
