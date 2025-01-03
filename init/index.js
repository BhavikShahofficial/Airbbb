const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//running mongoose for mongoDB
const mongoUrl = "mongodb://127.0.0.1:27017/airbbb";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67717c4d89583552ca6e5406",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data Was Initialized");
};

initDb();
