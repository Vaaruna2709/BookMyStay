const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const express = require("express");
const User = require("../models/user.js")
main()
  .then((res) => {
    console.log("connection successful");
    initDB();
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
async function initDB() {
  try {
    await Listing.deleteMany({});
    const user = await User.findOne(); // or create a new one if none exists

    if (!user) {
      const newUser = await User.create({ username: "admin", email: "admin@example.com" });
      userId = newUser._id;
    } else {
      userId = user._id;
    }

    initData.data = initData.data.map((obj) => ({ ...obj, owner: userId }));
    await Listing.insertMany(initData.data);
    console.log("Data initialized successfully");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}
