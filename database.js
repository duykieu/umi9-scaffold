const path = require("path");
const envPath = path.join(__dirname, ".env");

const config = require("dotenv").config({ path: envPath });

if (config.error) {
  throw config.error;
}

const mongoose = require("mongoose");
const database = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected successfully".cyan))
  .catch(console.log);
