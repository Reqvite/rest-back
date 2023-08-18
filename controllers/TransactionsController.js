const { mongoose } = require('mongoose');
const { Order, Transaction, Restaurant } = require('../models');
const LiqPayService = require('../services/liqpay/liqpayService');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const Personnel = require('../models/personnelModel');
const { AuthorizationError } = require('../utils/errors/CustomErrors');
const statiscticsPipeline = require('../utils/pipelines/statisctics');

const TransactionsController = {
  createPayOnline: asyncErrorHandler(async (req, res) => {
    const { amount, info, frontLink, rest_id } = req.body;
    const liqPayOrder_id = new mongoose.Types.ObjectId();

    const { name } = await Restaurant.findById(rest_id);

    const paymentInfo = LiqPayService.getLiqPayPaymentData(
      amount,
      liqPayOrder_id,
      info,
      frontLink,
      name
    );

    res.status(201).json({ status: 'success', code: 200, paymentInfo });
  }),
  updateStatus: asyncErrorHandler(async (req, res) => {
    const { data, signature } = req.body;
    const { status, info, order_id, description, amount } = LiqPayService.getPaymentStatus(
      data,
      signature
    );
    const infoIds = info.split(',').map((id) => id.trim());

    const start = description.indexOf('"');
    const end = description.lastIndexOf('"');
    const restaurantName = description.substring(start + 1, end);
    const { _id } = await Restaurant.findOne({ name: restaurantName });

    if (status === 'success') {
      await Order.updateMany({ _id: { $in: infoIds } }, { status: 'Paid' });
      await Transaction.create({
        rest_id: _id,
        paymentAmount: amount,
        _id: order_id,
        type: 'online',
        restaurantOrders_id: infoIds,
        status: 'success',
      });
    }

    return res.status(200).json({
      code: 204,
      status: 'success',
    });
  }),
  createPayOffline: asyncErrorHandler(async (req, res) => {
    const { createdById, amount, info, type } = req.body;

    const user = await Personnel.findOne({ _id: createdById });

    if (!user || (user.role !== 'admin' && user.role !== 'waiter')) {
      throw new AuthorizationError('Acces denied.');
    }

    await Transaction.create({
      rest_id: user.restaurant_id,
      createdByType: user.role,
      createdByName: user.name,
      paymentAmount: amount,
      type,
      restaurantOrders_id: info,
      status: 'success',
    });

    res.status(201).json({ status: 'success', code: 201 });
  }),
  getTransactions: asyncErrorHandler(async (req, res) => {
    const { rest_id } = req.params;
    const {
      pageIndex,
      pageSize,
      today,
      userType = 'all',
      transactionType = 'all',
      date,
    } = req.query;
    const perPage = pageSize;
    let newPageIndex = pageIndex;
    let query = { rest_id, status: 'success' };

    if (today === 'true') {
      const currentDate = new Date();
      const todayStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const tomorrowStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );

      query.createdAt = { $gte: todayStartDate, $lt: tomorrowStartDate };
    }

    if (userType !== 'all') {
      query.createdByType = userType;
    }

    if (transactionType !== 'all') {
      query.type = transactionType;
    }

    if (date !== 'undefined') {
      const selectedDate = new Date(date);
      selectedDate.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.createdAt = { $gte: selectedDate, $lte: endOfDay };
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(newPageIndex * perPage)
      .limit(perPage);

    const totalTransactions = await Transaction.countDocuments(query);

    const pageCount = Math.ceil(totalTransactions / perPage);

    const tableTransactions = { transactions, pageCount, currentPageIndex: newPageIndex };

    return res.status(200).json({
      code: 200,
      status: 'success',
      tableTransactions,
    });
  }),
  getTransactionsStatisticsByRestuarantId: asyncErrorHandler(async (req, res) => {
    const { rest_id } = req.params;
    const { timestamp = 'month' } = req.query;
    const restaurant = await Restaurant.findById(rest_id);

    if (!restaurant) {
      throw new NotFoundError('No restaurant records found for the given restaurant ID!');
    }

    let pipeline;
    const today = new Date();
    today.setUTCHours(21, 0, 0, 0);

    if (timestamp === 'year') {
      pipeline = statiscticsPipeline.year(rest_id);
    }

    if (timestamp === 'month') {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      pipeline = statiscticsPipeline.oneMonth(rest_id, firstDayOfMonth, lastDayOfMonth);
    }

    if (timestamp === 'week') {
      const currentDayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      const count = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
      startOfWeek.setDate(today.getDate() - count);
      const endOfWeek = new Date(today);

      pipeline = statiscticsPipeline.weekly(rest_id, endOfWeek, startOfWeek);
    }

    const statistics = await Transaction.aggregate(pipeline);

    return res.status(200).json({
      code: 200,
      status: 'success',
      statistics,
    });
  }),
};

module.exports = TransactionsController;
