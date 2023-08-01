const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  picture: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    maxlength: 200,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\+\d{1,3}\s?\d{1,15}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  webSite: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
      },
      message: (props) => `${props.value} is not a valid website URL!`,
    },
  },
  type: {
    type: String,
  },
  workHours: {
    Monday: { type: String, default: "Closed" },
    Tuesday: { type: String, default: "Closed" },
    Wednesday: { type: String, default: "Closed" },
    Thursday: { type: String, default: "Closed" },
    Friday: { type: String, default: "Closed" },
    Saturday: { type: String, default: "Closed" },
    Sunday: { type: String, default: "Closed" },
  },
  dishes_ids: [{ type: Schema.Types.ObjectId, ref: "Dish" }],
});

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;
