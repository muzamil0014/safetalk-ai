// ============================================================
// SAFETALK AI
// MONGODB DATABASE CONNECTION
// ============================================================

import mongoose from "mongoose";


// ============================================================
// GET MONGODB URI
// ============================================================

const MONGODB_URI = process.env.MONGODB_URI;


// ============================================================
// VALIDATE ENV VARIABLE
// ============================================================

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI inside .env.local"
  );
}


// ============================================================
// GLOBAL CACHE
//
// Development mode me Next.js baar baar reload hota hai.
// Is cache ki wajah se multiple MongoDB connections
// create nahi hongi.
// ============================================================

let cached =
  global.mongooseConnection;


if (!cached) {

  cached =
    global.mongooseConnection = {
      connection: null,
      promise: null,
    };

}


// ============================================================
// CONNECT DATABASE
// ============================================================

export default async function connectDB() {

  // Already connected
  if (cached.connection) {
    return cached.connection;
  }


  // Connection promise create
  if (!cached.promise) {

    const options = {
      bufferCommands: false,
    };


    cached.promise =
      mongoose
        .connect(
          MONGODB_URI,
          options
        )
        .then((mongooseInstance) => {

          console.log(
            "✅ MongoDB Connected Successfully"
          );

          return mongooseInstance;
        });

  }


  try {

    cached.connection =
      await cached.promise;

  } catch (error) {

    cached.promise = null;

    console.error(
      "❌ MongoDB Connection Error:",
      error
    );

    throw error;
  }


  return cached.connection;
}