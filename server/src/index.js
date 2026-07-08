import "./instrumentation.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`🚀 API Momentum en local sur http://localhost:${env.port}`);
});
