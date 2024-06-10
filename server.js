import express from "express";
import cors from "cors";
import { router as routes } from "./src/routes/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());

app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  next();
});

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
