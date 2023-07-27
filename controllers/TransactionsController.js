const { Transaction } = require("../models");
const LiqPayService = require("../services/liqpay/liqpayService");

const TransactionsController = {
  create: async (req, res) => {
    const { amount, order_id, type } = req.body;
    const paymentData = LiqPayService.getLiqPayPaymentData(amount, order_id);

    const existingTransaction = await Transaction.findOne({ order_id });

    if (!existingTransaction) {
      await Transaction.create({
        paymentAmount: amount,
        order_id,
        type,
      });
    }

    console.log(
      `https://www.liqpay.ua/api/3/checkout?data=${paymentData.data}&signature=${paymentData.signature}`
    );

    res.status(201).json({ status: "succes", code: 201, paymentData });
  },
};

module.exports = TransactionsController;
