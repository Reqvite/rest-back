const { Table, Order } = require('../models');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const {
  NotFoundError,
  AuthorizationError,
  BadRequestError,
} = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { sendEventToClients } = require('../utils/sse');
const { OK } = StatusCodes;

const tableController = {
  getTable: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const table = await Table.findById(id);

    if (!table) {
      const err = new NotFoundError('Table not found for the given table ID!');
      return next(err);
    }

    res.status(OK).json(table);
  }),

  getTablesByRestaurantId: asyncErrorHandler(async (req, res, next) => {
    const { rest_id } = req.params;
    const tables = await Table.find({ restaurant_id: rest_id });

    if (!tables) {
      const err = new BadRequestError();
      return next(err);
    }

    res.status(OK).json(tables);
  }),

  updateTable: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status, restaurant_id } = req.body;
    let updatedTable = [];
    let response = {};

    const table = await Table.findById(id);

    if (!table) {
      const err = new NotFoundError('Table not found for the given table ID!');
      return next(err);
    }

    if (table.restaurant_id.toString() !== restaurant_id) {
      const err = new AuthorizationError();
      return next(err);
    }

    table.status = status;

    if (status !== 'Free') {
      updatedTable = await table.save();
      response.updatedTable = updatedTable;
    }

    if (status === 'Free') {
      const orders = await Order.find({
        table_id: id,
        rest_id: restaurant_id,
        status: { $nin: ['Closed', 'Canceled'] },
      });

      const hasUnservedDishes = orders.some((order) => {
        return order.orderItems.some((item) => item.status !== 'Served');
      });

      if (hasUnservedDishes) {
        const err = new BadRequestError(
          'Cannot change table status. Some dishes are not served yet.'
        );
        return next(err);
      }

      if (orders.length === 0) {
        updatedTable = await table.save();
        response.updatedTable = updatedTable;
      } else {
        const allOrdersCanBeClosed = orders.every((order) => {
          return order.status === 'Paid';
        });

        if (!allOrdersCanBeClosed) {
          const err = new NotFoundError('Not all orders are paid for this table ID!');
          return next(err);
        }

        if (allOrdersCanBeClosed) {
          await Promise.all(orders.map((order) => closeOrder(order)));
          updatedTable = await table.save();
          response.updatedTable = updatedTable;
          response.updatedOrders = orders;
        }
      }
    }

    const eventMessage = `Table number ${table.table_number} is ${status}`;
    const eventType = 'table status';
    sendEventToClients(restaurant_id, eventMessage, eventType);

    res.status(OK).json(response);
  }),
};

module.exports = tableController;

async function closeOrder(order, session) {
  order.status = 'Closed';
  await order.save({ session });
}
