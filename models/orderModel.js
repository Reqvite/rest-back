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
        dish_id: {
          type: mongoose.ObjectId,
          ref: "Dish",
          required: [true, "At least one item is required"],
        },
        quantity: Number,

        _id: false,
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
  { versionKey: false, timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
