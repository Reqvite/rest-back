const { Restaurant, Transaction } = require('../models');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const statiscticsPipeline = require('../utils/pipelines/statisctics');
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
    const { timestamp = 'year' } = req.query;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      throw new NotFoundError('No restaurant records found for the given restaurant ID!');
    }

    let pipeline;
    const today = new Date();

    if (timestamp === 'year') {
      pipeline = statiscticsPipeline.year(id);
    }

    if (timestamp === 'month') {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      pipeline = statiscticsPipeline.oneMonth(id, firstDayOfMonth, lastDayOfMonth);
    }

    if (timestamp === 'week') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      pipeline = statiscticsPipeline.weekly(id, today, oneWeekAgo);
    }

    const statistics = await Transaction.aggregate(pipeline);

    return res.status(200).json({
      code: 200,
      status: 'success',
      statistics,
    });
  }),
};

module.exports = restaurantsController;
