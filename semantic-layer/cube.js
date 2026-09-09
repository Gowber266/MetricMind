const path = require("path");
const SqliteDriver = require("@cubejs-backend/sqlite-driver");

const dbPath = path.resolve(__dirname, "..", "backend", "sales.db");

module.exports = {
  apiSecret: process.env.CUBEJS_API_SECRET || "metricmind_secret_key",
  dbType: "sqlite",
  driverFactory: () => {
    return new SqliteDriver({ database: dbPath });
  },

  cacheAndQueueDriver: "memory",
  schemaPath: "models",

  contextToApiScopes: () => ["graphql", "meta", "data"],

  checkAuth: (req, auth) => {
    return true;
  },

  scheduledRefreshTimer: 60,
};
