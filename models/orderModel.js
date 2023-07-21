const mongoose = require("mongoose");
const { Schema, ObjectId, model } = mongoose;

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
          type: ObjectId,
          ref: "Dish",
          required: [true, "At least one item is required"],
        },
        quantity: {
          type: Number,
          min: [1, "Minimum number of units 1"],
        },
        status: {
          type: String,
          enum: {
            values: ["Ordered", "In progress", "Ready", "Served"],
            message: "{VALUE} is not supported",
          },
          default: "Ordered",
        },
      },
    ],
    table_id: {
      type: ObjectId,
      ref: "Table",
      required: [true, "Table id is required"],
    },
    waiter_id: {
      type: ObjectId,
      ref: "Waiter",
    },
  },
  { versionKey: false }
);

const Order = model("Order", orderSchema);

module.exports = Order;
