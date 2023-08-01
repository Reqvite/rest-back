const { Table } = require('../models');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError, AuthorizationError } = require('../utils/errors/CustomErrors');

const tableController = {
  getTable: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const table = await Table.findById(id);

    if (table === null || (Array.isArray(table) && table.length === 0)) {
      const err = new NotFoundError('Table not found for the given table ID!');
      return next(err);
    }

    res.status(200).json(table);
  }),

  getTablesByRestaurantId: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const tables = await Table.find({ restaurant_id: id });

    if (tables === null || (Array.isArray(tables) && tables.length === 0)) {
      const err = new NotFoundError('Table not found for the given table ID!');
      return next(err);
    }

    res.status(200).json(tables);
  }),

  updateTable: asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const table = await Table.findById(id);

    if (table === null || (Array.isArray(table) && table.length === 0)) {
      const err = new NotFoundError('Table not found for the given table ID!');
      return next(err);
    }

    //Take a restaurant id from the request body and check if it matches the rest id of the table
    if (table.restaurant_id.toString() !== req.body.restaurant_id) {
      console.log(table.restaurant_id.toString());
      console.log(req.body.restaurant_id);
      const err = new AuthorizationError();
      return next(err);
    }

    // Update status of the table
    table.status = status;

    // Save the updated status to the database
    const updatedTable = await table.save();

    res.status(200).json(updatedTable);
  }),

  // updateTable: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const updates = req.body;

  //     const updatedTable = await Table.findByIdAndUpdate(id, updates, {
  //       new: true,
  //       runValidators: true,
  //     });

  //     if (!updatedTable) {
  //       return res.status(404).json({ error: 'Table not found' });
  //     }
  //     res.status(200).json(updatedTable);
  //   } catch (error) {
  //     if (error.name === 'ValidationError') {
  //       return res.status(400).json({ errors: error.errors });
  //     }
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // },
};

module.exports = tableController;
