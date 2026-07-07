import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

import meRoutes from "./routes/me.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import taskRoutes from "./routes/task.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import activitiesRoutes from "./routes/activities.routes.js";
import searchRoutes from "./routes/search.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use("/api", apiLimiter);
  app.use("/api/auth", authLimiter);

  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  app.use("/api/me", meRoutes);
  app.use("/api/projects", projectsRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/categories", categoriesRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/activities", activitiesRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/calendar", calendarRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
