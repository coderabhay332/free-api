import express from "express";
import cors from "cors";
import userRoutes from "./app/user/user.route";
import serviceRoutes from "./app/service/service.route";
import appRoutes from "./app/app/app.route";

const app = express();


app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/apps", appRoutes);

export default app; 