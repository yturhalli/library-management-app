import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./db/typeorm.config";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
  })
  .catch((error) => console.log(error));
