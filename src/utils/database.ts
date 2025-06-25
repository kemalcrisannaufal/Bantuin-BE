import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-bantuin",
    });
    return Promise.resolve("Database Connected!");
  } catch (error) {
    const err = error as Error;
    return Promise.reject(err.message);
  }
};

export default connect;
