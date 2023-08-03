const { Order, Transaction } = require('../models');
const LiqPayService = require('../services/liqpay/liqpayService');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');

const TransactionsController = {
  create: asyncErrorHandler(async (req, res) => {
    const { amount, order_id, type, info, frontLink } = req.body;

    const paymentInfo = LiqPayService.getLiqPayPaymentData(amount, order_id, info, frontLink);

    const transaction = await Transaction.findOne({ liqPayOrder_id: order_id });
    if (!transaction) {
      await Transaction.create({
        paymentAmount: amount,
        liqPayOrder_id: order_id,
        type,
        restaurantOrders_id: info,
      });
    }

    res.status(201).json({ status: 'succes', code: 201, paymentInfo });
  }),
  updateStatus: asyncErrorHandler(async (req, res) => {
    const { data, signature } = req.body;
    const { status, info } = LiqPayService.getPaymentStatus(data, signature);

    if (status === 'success') {
      await Order.updateMany({ _id: { $in: info.split(',') } }, { status: 'Paid' });
    }

    return res.status(200).json({
      code: 204,
      status: 'success',
    });
  }),
};

module.exports = TransactionsController;
