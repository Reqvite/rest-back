const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const transactionSchema = new Schema(
  {
    rest_id: {
      type: ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant id is required'],
    },
    paymentAmount: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: (props) => `${props.value} is not a valid payment amount!`,
      },
      description: 'The amount of the payment transaction.',
    },
    restaurantOrders_id: {
      type: Array,
      required: [true, 'Id or Ids of the order associated with the transaction.'],
    },
    status: {
      type: String,
      enum: ['success'],
      required: true,
      description: 'The type of transaction.',
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['cash', 'POS', 'online'],
      required: true,
      description: 'The type of transaction.',
    },
    createdByType: {
      type: String,
      required: true,
      enum: ['customer', 'waiter', 'admin'],
      description: 'Who created the transaction.',
      default: 'customer',
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: 'Personnel',
    },
    createdByName: {
      type: String,
      description: 'The name of the person who created the transaction.',
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
