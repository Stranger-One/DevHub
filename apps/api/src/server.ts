import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";


async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    
    const PORT = process.env.PORT;
    if (!PORT) {
      console.log(
        "PORT environment variable is not defined or not accessible. Using default port 5000.",
      );
    } else {
      console.log(`Environment variable loaded. Using port ${PORT}.`);
    }
    const port = Number(PORT ?? 5000);

    const server = app.listen(port, () => {
      console.log(`DevHub API listening on http://localhost:${port}`);
    });

    const shutdown = (signal: string): void => {
      console.log(`${signal} received; shutting down`);

      server.close(() => {
        void import("mongoose").then(({ default: mongoose }) =>
          mongoose.disconnect().finally(() => process.exit(0)),
        );
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start DevHub API:", error);
    process.exitCode = 1;
  }
}

void startServer();
