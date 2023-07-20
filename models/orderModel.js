const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    status: {
      type: String,
      enum: {
        values: ["Open", "Paid"],
        message: "{VALUE} is not supported",
      },
      default: "Open",
    },
    orderItems: [
      {
        dish: {
          type: mongoose.ObjectId,
          ref: "Dish",
          required: [true, "At least one item is required"],
        },
        quantity: Number,
      },
    ],
    table_id: {
      type: mongoose.ObjectId,
      ref: "Table",
      required: [true, "Table id is required"],
    },
    waiter_id: {
      type: mongoose.ObjectId,
      ref: "Waiter",
    },
  },
  { versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
