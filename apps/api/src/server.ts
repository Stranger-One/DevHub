import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

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

app.listen(port, () => {
  console.log(`DevHub API listening on http://localhost:${port}`);
});
