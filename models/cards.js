const mongoose = require("mongoose");
const JOI = require("joi");
const _ = require("lodash");
require("../app");

const CardSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
    minlenght: 2,
    maxlenght: 100,
  },
  Description: {
    type: String,
    require: true,
    minlenght: 3,
    maxlenght: 1000,
  },
  Address: {
    type: String,
    require: true,
    minlenght: 5,
    maxlenght: 250,
  },
  Phone: {
    type: String,
    required: true,
    minlenght: 8,
  },
  Image: {
    type: String,
    minlenght: 10,
  },
  bizNumber: {
    type: String,
    required: true,
    minlenght: 3,
    unique: true,
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    reference:'User',
  },
});
const CardModel = mongoose.model("CarModel", CardSchema, "cards");



module.exports=CardModel;


