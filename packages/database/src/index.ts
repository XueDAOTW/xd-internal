import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

export * from "@prisma/client";

dotenv.config();

const defaultPrismaClientOptions = {
  datasources: {
    db: {
      url: process.env["DATABASE_URL"] as string,
    },
  },
};

export function createClient(
  options = defaultPrismaClientOptions,
): PrismaClient {
  if (!process.env["DATABASE_URL"]) throw new Error("DATABASE_URL is required");

  return new PrismaClient(options);
}
