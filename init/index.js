const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const express = require("express");
main()
.then((res)=>{
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
      await Listing.insertMany(initData.data);
      console.log("Data initialized successfully");
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }
