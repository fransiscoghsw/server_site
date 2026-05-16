const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

module.exports = {
    apps: [
        {
            name: "name",
            script: "app.js",
            env: {
                NODE_ENV: "development",
                PORT: process.env.PORT,
            },
        },
    ],
};
