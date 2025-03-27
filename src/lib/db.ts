import mongoose, { Connection } from "mongoose";

const MONGODB_URI =
  "mongodb+srv://richardrak:rcadrktmv6591@cluster0.wraca.mongodb.net/ecommerce-01?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
