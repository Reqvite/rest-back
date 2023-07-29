const { Table, Restaurant } = require("../../models");

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

const checkRestaurantId = async (req, res, next) => {
  if (req.body.restaurant_id) {
    try {
      const restaurant = await Restaurant.findById(req.body.restaurant_id);
      if (!restaurant) {
        return res.status(400).json({
          error: "Restaurant not found. Please provide a valid restaurant ID.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    next();
  }
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
  checkRestaurantId,
  checkExistingTable,
};
