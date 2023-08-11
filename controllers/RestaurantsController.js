const { monthNames } = require('../constants/constants');
const { Restaurant, Transaction } = require('../models');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK } = StatusCodes;

const restaurantsController = {
  getRestaurantById: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      const err = new NotFoundError('No restaurant records found for the given restaurant ID!');
      return next(err);
    }

    res.status(OK).json(restaurant);
  }),
  getStatisticsByRestuarantId: asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    let statistics = {};

    if (!restaurant) {
      throw new NotFoundError('No restaurant records found for the given restaurant ID!');
    }

    const transactions = await Transaction.find({
      rest_id: id,
    });

    const monthlyStatistics = Array.from({ length: 12 }, (_, month) => ({
      name: monthNames[month],
      transactions: 0,
      amount: 0,
      online: 0,
      cash: 0,
      POS: 0,
    }));

    for (const transaction of transactions) {
      const month = new Date(transaction.createdAt).getMonth();

      monthlyStatistics[month].transactions++;
      monthlyStatistics[month].amount += Number(transaction.paymentAmount.toFixed(2));
      monthlyStatistics[month][transaction.type]++;
    }

    statistics.monthlyStatistics = monthlyStatistics;

    return res.status(200).json({
      code: 200,
      status: 'success',
      statistics,
    });
  }),
};

module.exports = restaurantsController;
