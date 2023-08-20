const { mongoose } = require('mongoose');
const { Order, Transaction, Restaurant } = require('../models');
const LiqPayService = require('../services/liqpay/liqpayService');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { BadRequestError } = require('../utils/errors/CustomErrors');
const statiscticsPipeline = require('../utils/pipelines/statisctics');
const parseBool = require('../utils/helpers/parseBool');

const TransactionsController = {
  createPayOnline: asyncErrorHandler(async (req, res) => {
    const { amount, info, frontLink, rest_id } = req.body;
    const liqPayOrder_id = new mongoose.Types.ObjectId();

    const restaurant = await Restaurant.findById(rest_id);
    if (!restaurant) {
      const err = new NotFoundError('No restaurant records found for the given restaurant ID!');
      return next(err);
    }
    const name = restaurant.name;

    const paymentInfo = LiqPayService.getLiqPayPaymentData(
      amount,
      liqPayOrder_id,
      info,
      frontLink,
      name
    );

    res.status(200).json({ status: 'success', code: 200, paymentInfo });
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

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (status === 'success') {
        await Order.updateMany({ _id: { $in: infoIds } }, { status: 'Paid' }, { session });
        await Transaction.create(
          [
            {
              rest_id: _id,
              paymentAmount: amount,
              _id: order_id,
              type: 'online',
              restaurantOrders_id: infoIds,
              status: 'success',
            },
          ],
          { session }
        );
        await session.commitTransaction();
      }
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return res.status(200).json({
      code: 204,
      status: 'success',
    });
  }),
  createPayOffline: asyncErrorHandler(async (req, res) => {
    const { amount, info, type } = req.body;

    const user = req.user;

    const existingTransactions = await Transaction.find({
      restaurantOrders_id: { $in: info },
    });

    if (existingTransactions.length !== 0) {
      throw new BadRequestError('Orders with such IDs have already been paid');
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

    if (parseBool(today)) {
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

    if (parseBool(date)) {
      const selectedDate = new Date(date);
      selectedDate.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.createdAt = { $gte: selectedDate, $lte: endOfDay };
    }

    if (!newPageIndex || !perPage) {
      throw new BadRequestError('Missing pagination newPageIndex and perPage parameters');
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
  getTransactionsStatisticsByRestaurantId: asyncErrorHandler(async (req, res) => {
    const { rest_id } = req.params;
    const { timestamp = 'month' } = req.query;
    const restaurant = await Restaurant.findById(rest_id);

    if (!restaurant) {
      throw new NotFoundError('No restaurant records found for the given restaurant ID!');
    }

    let pipeline;
    const today = new Date(2023, 7, 22);
    const offset = today.getTimezoneOffset();
    today.setUTCHours(21, 0, 0, 0);
    today.setMinutes(today.getMinutes() + offset);

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
