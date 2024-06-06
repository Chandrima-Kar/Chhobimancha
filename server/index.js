// File: server.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import moviesRouter from "./routes/movieRoutes.js";
import cineastsRouter from "./routes/cineastRoutes.js";
import theatresRouter from "./routes/theatreRoutes.js";
import showsRouter from "./routes/showRoutes.js";
import bookingsRouter from "./routes/bookingRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
<<<<<<< HEAD
import uploadRouter from "./routes/uploadFile.js";
=======
import uploadRouter from "./controllers/uploadFile.js";
// import testRouter from "./controllers/testUpload.js";
>>>>>>> bd64a0c1dcada89c1ca6f1974548ea52f3b3e35d

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.SITE_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Connect to the database
connectDB();

// Main route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Other routes
app.use("/api/users", userRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/cineasts", cineastsRouter);
app.use("/api/shows", showsRouter);
app.use("/api/theatres", theatresRouter);
app.use("/api/bookings", bookingsRouter);
<<<<<<< HEAD
app.use("/api/upload", uploadRouter);
=======
// app.use("/api/test", testRouter);
>>>>>>> bd64a0c1dcada89c1ca6f1974548ea52f3b3e35d

// Error handling middleware should be placed after all routes and middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
