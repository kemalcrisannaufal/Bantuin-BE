import express from "express";
import router from "./routes/api";
import db from "../src/utils/database";
import cors from "cors";
import docs from "./docs/routes";
import response from "./utils/response";

async function init() {
  try {
    const result = await db();
    console.log("Database status :", result);

    const app = express();

    app.use(cors());
    app.use(express.json());

    const PORT = 3000;

    app.use("/api", router);
    docs(app);

    app.get("/", (req, res) => {
      res.status(200).json({ message: "Server is Running", data: null });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
