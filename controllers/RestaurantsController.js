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
          status: 'success',
        },
      },
      {
        $facet: {
          monthlyData: [
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
          ],
          timeBasedData: [
            {
              $group: {
                _id: null,
                totalToday: {
                  $sum: {
                    $cond: [
                      { $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))] },
                      '$paymentAmount',
                      0,
                    ],
                  },
                },
                totalThisWeek: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gte: ['$createdAt', new Date(new Date() - 7 * 24 * 60 * 60 * 1000)] },
                          { $lt: ['$createdAt', new Date()] },
                        ],
                      },
                      '$paymentAmount',
                      0,
                    ],
                  },
                },
                totalThisMonth: {
                  $sum: {
                    $cond: [
                      { $gte: ['$createdAt', new Date(new Date().setDate(1))] },
                      '$paymentAmount',
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalToday: { $round: ['$totalToday', 2] },
                totalThisWeek: { $round: ['$totalThisWeek', 2] },
                totalThisMonth: { $round: ['$totalThisMonth', 2] },
              },
            },
          ],
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
