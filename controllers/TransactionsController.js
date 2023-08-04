const { mongoose } = require('mongoose');
const { Order, Transaction } = require('../models');
const LiqPayService = require('../services/liqpay/liqpayService');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');

const TransactionsController = {
  create: asyncErrorHandler(async (req, res) => {
    const { amount, type, info, frontLink } = req.body;
    let liqPayOrder_id = new mongoose.Types.ObjectId();
    const infoIds = info.split(',').map((id) => id.trim());

    await Transaction.updateMany(
      {
        restaurantOrders_id: { $in: infoIds },
        status: { $ne: 'canceled' },
      },
      { $set: { status: 'canceled' } }
    );

    await Transaction.create({
      paymentAmount: amount,
      _id: liqPayOrder_id,
      type,
      restaurantOrders_id: infoIds,
    });

    const paymentInfo = LiqPayService.getLiqPayPaymentData(amount, liqPayOrder_id, info, frontLink);

    res.status(201).json({ status: 'success', code: 201, paymentInfo });
  }),

  updateStatus: asyncErrorHandler(async (req, res) => {
    const { data, signature } = req.body;
    const { status, info, order_id } = LiqPayService.getPaymentStatus(data, signature);
    const infoIds = info.split(',').map((id) => id.trim());

    if (status === 'success') {
      await Order.updateMany({ _id: { $in: infoIds } }, { status: 'Paid' });
      await Transaction.findOneAndUpdate({ _id: order_id }, { $set: { status: 'sucess' } });
    }

    return res.status(200).json({
      code: 204,
      status: 'success',
    });
  }),
};

module.exports = TransactionsController;
