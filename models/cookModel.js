const { Schema, model } = require("mongoose");

const cookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  picture: {
    type: String
  }
});

const Cook = model("Cook", cookSchema);

module.exports = Cook;
