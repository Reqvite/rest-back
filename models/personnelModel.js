const { Schema, model } = require('mongoose');

const personnelSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Female', 'Male'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'cook', 'waiter'],
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant_id is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  picture: {
    type: String,
  },
});

const Personnel = model('Personnel', personnelSchema);

module.exports = Personnel;
