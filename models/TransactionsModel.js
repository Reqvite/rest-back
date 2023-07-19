const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    /*_id: {
        type: String,
        required: true,
        match: /^[0-9a-fA-F]{24}$/,
        validate: {
            validator: function(v) {
                return /^[0-9a-fA-F]{24}$/.test(v);
            },
            message: props => `${props.value} is not a valid ID!`
        },
        description: 'The unique ID of the transaction.'
    },*/
    paymentAmount: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid payment amount!`
        },
        description: 'The amount of the payment transaction.'
    },
    paymentDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return !isNaN(Date.parse(v));
            },
            message: props => `${props.value} is not a valid date!`
        },
        description: 'The date of the payment transaction.'
    },
    order_id: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return Number.isInteger(v) && v >= 0;
            },
            message: props => `${props.value} is not a valid order ID!`
        },
        description: 'The unique ID of the order associated with the transaction.'
    },
    type: {
        type: String,
        enum: ['cash', 'card'],
        required: true,
        description: 'The type of transaction.'
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
