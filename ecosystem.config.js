module.exports = {
  apps: [
    {
      name: "sms-crms-supra",
      script: "./dist/app.js", // Path to your entry file
      env: {
        NODE_ENV: "development",
        MONGODB_URI: process.env.DB_URI,
      },
      env_production: {
        NODE_ENV: "production",
        MONGODB_URI: process.env.DB_URI,
      },
    },
  ],
};
