import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

try {
  await connectDB();
  app.listen(port, () => {
    console.log("Notes/Task API listening on port " + port);
  });
} catch (error) {
  console.error("Unable to start Notes/Task API:", error.message);
  process.exit(1);
}
