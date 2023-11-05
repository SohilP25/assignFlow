import express from "express";
import connectDB from "./config/db_connection.js";
import router from "./routes/index.js";
import bodyParser from "body-parser";
import multer from "multer";
import 'dotenv/config'

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});

app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.send("Hey There!, I'm Ready to Integrate.");
});
