const { Schema, model } = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

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

const cookJoiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(30).required(),
  restaurant_id: Joi.objectId().required(),
  phone: Joi.string().min(8).max(12),
  email: Joi.string().min(8).max(20),
  address: Joi.string().min(8).max(50),
  picture: Joi.string().min(5).max(100)
});

const Cook = model("Cook", cookSchema);

module.exports = { Cook, cookJoiSchema };
