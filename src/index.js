import connectDB from "./db/db.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

connectDB()
  .then(() => {
    try {
      app.listen(port || 8000, () => {
        console.log(`running on ${port}`);
      });
    } catch (error) {
      console.log({ "Error in the listen port": error });
    }
  })
  .catch((error) => {
    console.log({ "error on app": error });
  });
