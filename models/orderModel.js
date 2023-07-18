const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    status: {
      type: String,
      enum: {
        values: ["Pending", "Cooking", "Served"],
        message: "{VALUE} is not supported",
      },
      default: "Pending",
    },
    orderItems: [
      {
        dish_id: {
          type: mongoose.ObjectId,
          ref: "Dish",
        },
        quantity: Number,
        _id: false,
      },
    ],
    table_id: {
      type: mongoose.ObjectId,
      ref: "Table",
    },
    waiter_id: {
      type: mongoose.ObjectId,
      ref: "Waiter",
    },
  },
  { versionKey: false, timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
