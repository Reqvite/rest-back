const { Order, Transaction } = require("../models");
const LiqPayService = require("../services/liqpay/liqpayService");

const TransactionsController = {
  create: async (req, res) => {
    const { amount, order_id, type } = req.body;

    const paymentInfo = LiqPayService.getLiqPayPaymentData(amount, order_id);

    const existingTransaction = await Transaction.findOne({ order_id });

    if (!existingTransaction) {
      await Transaction.create({
        paymentAmount: amount,
        order_id,
        type,
      });
    }

    console.log(
      `https://www.liqpay.ua/api/3/checkout?data=${paymentInfo.data}&signature=${paymentInfo.signature}`
    );

    res.status(201).json({ status: "succes", code: 201, paymentInfo });
  },
  updateStatus: async (req, res) => {
    const { data, signature } = req.body;

    const { order_id, info } = LiqPayService.getPaymentStatus(data, signature);

    if (info) {
      //if multiple ids
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { status: "Paid" },
      { new: true }
    );

    return res.json({
      code: 200,
      status: "success",
      data: {
        updatedOrder,
      },
    });
  },
};

module.exports = TransactionsController;
