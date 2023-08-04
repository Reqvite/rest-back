const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
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
  paymentDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (v) {
        return !isNaN(Date.parse(v));
      },
      message: (props) => `${props.value} is not a valid date!`,
    },
    description: 'The date of the payment transaction.',
  },
  restaurantOrders_id: {
    type: Array,
    required: [true, 'Id or Ids of the order associated with the transaction.'],
  },
  type: {
    type: String,
    enum: ['cash', 'POS', 'online'],
    required: true,
    description: 'The type of transaction.',
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
