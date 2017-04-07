const config = {
  db: {
    production: process.env.MONGO_URL,
    development: process.env.MONGO_URL,
    //development: "mongodb://localhost:27017/typescript-db",
    //test: "mongodb://localhost/expense-tracker-test",
  },
  gitHubSimpleCache: ""
};

export default config;
