const { ObjectId } = require('bson');
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

    if (!restaurant) {
      throw new NotFoundError('No restaurant records found for the given restaurant ID!');
    }

    const pipeline = [
      {
        $match: {
          rest_id: new ObjectId(id),
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: '$createdAt',
            },
          },
          amount: {
            $sum: '$paymentAmount',
          },
          transactions: {
            $sum: 1,
          },
          online: {
            $sum: {
              $cond: [
                {
                  $eq: ['$type', 'online'],
                },
                1,
                0,
              ],
            },
          },
          pos: {
            $sum: {
              $cond: [
                {
                  $eq: ['$type', 'POS'],
                },
                1,
                0,
              ],
            },
          },
          cash: {
            $sum: {
              $cond: [
                {
                  $eq: ['$type', 'cash'],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $arrayElemAt: [monthNames, { $subtract: ['$_id.month', 1] }],
          },
          amount: 1,
          transactions: 1,
          online: 1,
          pos: 1,
          cash: 1,
        },
      },
    ];

    const statistics = await Transaction.aggregate(pipeline);

    return res.status(200).json({
      code: 200,
      status: 'success',
      statistics,
    });
  }),
};

module.exports = restaurantsController;
