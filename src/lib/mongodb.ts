import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MONGO_URI is not defined. Add it to your .env file to use the admin panel.",
    );
  }
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
  }
  const client = globalForMongo.mongoClient;
  try {
    await client.connect();
  } catch (err) {
    globalForMongo.mongoClient = undefined;
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("SSL") || message.includes("ssl") || message.includes("TLS")) {
      throw new Error(
        "MongoDB SSL/TLS connection failed. Make sure your IP is whitelisted in MongoDB Atlas (Network Access).",
      );
    }
    throw err;
  }
  return client;
}

export function getDbName(): string {
  return process.env.MONGO_DB ?? "techpunno";
}
