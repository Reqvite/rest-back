const { mongoose } = require('mongoose');
const { Order, Transaction, Restaurant } = require('../models');
const LiqPayService = require('../services/liqpay/liqpayService');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const {
  BadRequestError,
  AuthorizationError,
  NotFoundError,
} = require('../utils/errors/CustomErrors');
const statiscticsPipeline = require('../utils/pipelines/statisctics');
const parseBool = require('../utils/helpers/parseBool');
const moment = require('moment-timezone');
const Personnel = require('../models/personnelModel');
const { TIME_ZONE } = process.env;

const TransactionsController = {
  createPayOnline: asyncErrorHandler(async (req, res, next) => {
    const { amount, info, frontLink, rest_id } = req.body;
    const liqPayOrder_id = new mongoose.Types.ObjectId();

    const restaurant = await Restaurant.findById(rest_id);
    if (!restaurant) {
      const err = new NotFoundError('No restaurant records found for the given restaurant ID!');
      return next(err);
    }

    const existingTransactions = await Transaction.find({
      restaurantOrders_id: { $in: info.split(',') },
    });

    if (existingTransactions.length !== 0) {
      throw new BadRequestError('Orders with such IDs have already been paid');
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

    const restaurantName = description.slice(
      description.indexOf('"') + 1,
      description.lastIndexOf('"')
    );
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

    const user = await Personnel.findById(req.user.user_id);

    if (!user) {
      throw new AuthorizationError();
    }

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
      nameFilter,
      transactionSortType = 'newest',
    } = req.query;
    const perPage = pageSize;
    let newPageIndex = pageIndex;
    let query = { rest_id, status: 'success' };
    let sort = {createdAt: -1 };
    
    if (parseBool(today)) {
      const currentDate = moment().tz(TIME_ZONE);
      const todayStartDate = currentDate.clone().startOf('day');
      const tomorrowStartDate = currentDate.clone().add(1, 'day').startOf('day');

      query.createdAt = { $gte: todayStartDate.toDate(), $lt: tomorrowStartDate.toDate() };
    }

    if (userType !== 'all') {
      query.createdByType = userType;
    }

    if (transactionType !== 'all') {
      query.type = transactionType;
    }


    if (transactionSortType !== 'newest') {
      if (transactionSortType === 'ascending') {
        sort = { paymentAmount: 1 }; 
      } else if (transactionSortType === 'descending') {
        sort = { paymentAmount: -1 }; 
      }
    }

    if (parseBool(date)) {
      const selectedDate = moment.tz(date, TIME_ZONE);
      const startOfDay = selectedDate.clone().startOf('day');
      const endOfDay = selectedDate.clone().endOf('day');
      query.createdAt = { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() };
    }

    if(parseBool(nameFilter)){
      const nameRegex = new RegExp(nameFilter, 'i');
      query.createdByName = nameRegex;
    }

    if (!newPageIndex || !perPage) {
      throw new BadRequestError('Missing pagination newPageIndex and perPage parameters');
    }

    const transactions = await Transaction.find(query)
      .sort(sort)
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
    const today = moment().tz(TIME_ZONE);

    if (timestamp === 'year') {
      pipeline = statiscticsPipeline.year(rest_id);
    }

    if (timestamp === 'month') {
      const firstDayOfMonth = today.clone().startOf('month');
      const lastDayOfMonth = today.clone().endOf('month');
      pipeline = statiscticsPipeline.oneMonth(
        rest_id,
        firstDayOfMonth.toDate(),
        lastDayOfMonth.toDate()
      );
    }

    if (timestamp === 'week') {
      const startOfWeek = today.clone().startOf('week');
      const endOfWeek = today.clone().endOf('week');
      pipeline = statiscticsPipeline.weekly(rest_id, endOfWeek.toDate(), startOfWeek.toDate());
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
