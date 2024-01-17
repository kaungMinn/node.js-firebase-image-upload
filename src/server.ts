import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import router from "./controllers/upload-file-controller";
const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Firebase demo app of node.js-db-demo project!");
});

app.use("/upload", router);

app.listen(PORT, () => {
  console.log(`Server running on PORT-${PORT}`);
});
