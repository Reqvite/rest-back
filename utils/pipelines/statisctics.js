const { ObjectId } = require('mongodb');
const { monthNames, dayOfWeekNames } = require('../../constants/constants');

const getGroup = () => {
  return {
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
  };
};

const statiscticsPipeline = {
  oneMonth: (id, firstDayOfMonth, lastDayOfMonth) => [
    {
      $match: {
        rest_id: new ObjectId(id),
        createdAt: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        ...getGroup(),
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        amount: 1,
        transactions: 1,
        online: 1,
        pos: 1,
        cash: 1,
      },
    },
  ],
  year: (id) => [
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
        ...getGroup(),
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
  weekly: (id, today, oneWeekAgo) => [
    {
      $match: {
        rest_id: new ObjectId(id),
        createdAt: {
          $gte: oneWeekAgo,
          $lt: today,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        ...getGroup(),
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        name: {
          $arrayElemAt: [dayOfWeekNames, { $subtract: ['$_id', 1] }],
        },
        amount: 1,
        transactions: 1,
        online: 1,
        pos: 1,
        cash: 1,
      },
    },
  ],
};

module.exports = statiscticsPipeline;
