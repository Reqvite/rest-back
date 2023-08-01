const { Order, Transaction } = require("../models");
const LiqPayService = require("../services/liqpay/liqpayService");

const TransactionsController = {
  create: async (req, res) => {
    const { amount, order_id, type, info } = req.body;

    const paymentInfo = LiqPayService.getLiqPayPaymentData(
      amount,
      order_id,
      info
    );

    if (!(await Transaction.findOne({ order_id }))) {
      await Transaction.create({
        paymentAmount: amount,
        liqPayOrder_id: order_id,
        type,
        restaurantOrder_id: info,
      });
    }

    res.status(201).json({ status: "succes", code: 201, paymentInfo });
  },
  updateStatus: async (req, res) => {
    const { data, signature } = req.body;
    const { status, info } = LiqPayService.getPaymentStatus(data, signature);

    const updatedOrders = await Order.updateMany(
      { _id: { $in: info.split(",") } },
      { status: "Paid" },
      { new: true }
    );

    return res.status(200).json({
      code: 200,
      status: "success",
      data: {
        updatedOrders,
      },
    });
  },
};

module.exports = TransactionsController;
