const Joi = require("joi");
const {Schema, model} = require('mongoose')

const administratorSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, "Restaurant_id is required"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    picture: {
        type: String,
        required: [true, "Picture is required"],
    }

})

const administratorValidation = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(30).required(),
    restaurant_id: Joi.string().required(),
    gender: Joi.string().min(6).max(30).required(),
    phone: Joi.string().min(8).max(12),
    email: Joi.string().min(8).max(20),
    address: Joi.string().min(8).max(50),
    picture: Joi.string().min(5).max(100)
  });
  
const Administrator = model('Administrator', administratorSchema)

module.exports = {
    Administrator,
  };