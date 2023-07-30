const { Table, Restaurant } = require("../../models");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
};

const checkSeatsNumber = (req, res, next) => {
  if (req.body.seats && typeof req.body.seats !== "number") {
    return res.status(400).json({ error: "Seats must be a number" });
  }
  next();
};

const checkTableNumber = (req, res, next) => {
  if (req.body.table_number && typeof req.body.table_number !== "number") {
    return res.status(400).json({ error: "Table must be a number" });
  }
  next();
};

const checkExistingTable = async (req, res, next) => {
  const { id } = req.params;

  const currentTable = await Table.findById(id);

  if (!currentTable) {
    return res.status(404).json({ error: "Table not found" });
  }

  const existingTable = await Table.findOne({
    _id: { $ne: id },
    restaurant_id: currentTable.restaurant_id,
    table_number: req.body.table_number,
  });

  if (existingTable) {
    return res.status(400).json({
      error: "Table with this table number already exists for this restaurant",
    });
  }

  next();
};

module.exports = {
  checkSeatsNumber,
  checkTableNumber,
  checkExistingTable,
  validateObjectId,
};
