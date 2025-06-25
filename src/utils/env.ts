import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL: string = process.env.DATABASE_URL || "";
const SECRET: string = process.env.SECRET || "";

export { DATABASE_URL, SECRET };
