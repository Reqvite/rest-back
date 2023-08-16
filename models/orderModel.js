const mongoose = require('mongoose');
const { Schema, ObjectId, model } = mongoose;
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890', 10);

const orderSchema = new Schema(
  {
    number: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ['Open', 'Paid', 'Canceled', 'Closed'],
        message: '{VALUE} is not supported',
      },
      default: 'Open',
    },
    orderItems: [
      {
        dish: {
          type: Schema.Types.ObjectId,
          ref: 'Dish',
          required: [true, 'At least one item is required'],
        },
        quantity: {
          type: Number,
          min: [1, 'Minimum number of units 1'],
        },
        status: {
          type: String,
          enum: {
            values: ['Ordered', 'In progress', 'Ready', 'Served'],
            message: '{VALUE} is not supported',
          },
          default: 'Ordered',
        },
        comment: {
          type: String,
        },
      },
    ],
    table_id: {
      type: ObjectId,
      ref: 'Table',
      required: [true, 'Table id is required'],
    },
    rest_id: {
      type: ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant id is required'],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);
orderSchema.pre('save', async function (next) {
  if (!this.number) {
    this.number = nanoid(8);
  }
  next();
});
const Order = model('Order', orderSchema);

module.exports = Order;
