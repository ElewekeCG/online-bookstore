import dotenv from "dotenv";
dotenv.config();

import express, { json, urlencoded } from "express";
import { connectToDatabase } from "./db/connect";

const app = express();

// middleware for json parsing of request body
app.use(urlencoded({ extended: true }));
app.use(json());

import { RegisterRoutes } from "./routes/routes";
RegisterRoutes(app);

import { errorHandlerMiddleware } from "./middleware/error-handler";
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env file");
    }
    console.log("Connecting to database...");
    await connectToDatabase(mongoUri);
    console.log("Connected to database");
    console.log("Starting server...");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
