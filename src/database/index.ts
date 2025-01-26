import { DatabaseClient } from "./database-client";

const dbPromise = DatabaseClient.init("db.json")
  .then(() => {
    console.debug("Database initialized");
    return DatabaseClient.getInstance();
  })
  .catch((err) => {
    console.error("Error initializing DB:", err);
    throw err;
  });

export default dbPromise;
