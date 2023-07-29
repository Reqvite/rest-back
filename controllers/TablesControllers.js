const Table = require("../models/tableModel");
const Restaurant = require("../models/restaurantModel");

const tableController = {
  getAllTables: async (req, res) => {
    try {
      const result = await Table.find();

      if (!result) {
        return res.status(404).json({ error: "Table not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getTable: async (req, res) => {
    try {
      const { id } = req.params;

      const table = await Table.findById(id);

      if (!table) {
        return res.status(404).json({ error: "Table not found" });
      }
      res.status(200).json(table);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getTablesByRestaurantId: async (req, res) => {
    try {
      const { id } = req.params;
      const tables = await Table.find({ restaurant_id: id });
      res.status(200).json(tables);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateTable: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.seats && typeof updates.seats !== "number") {
        return res.status(400).json({ error: "Seats must be a number" });
      }

      if (updates.table_number && typeof updates.table_number !== "number") {
        return res.status(400).json({ error: "Table must be a number" });
      }

      if (updates.restaurant_id) {
        const restaurant = await Restaurant.findById(updates.restaurant_id);
        if (!restaurant) {
          return res.status(400).json({
            error:
              "Restaurant not found. Please provide a valid restaurant ID.",
          });
        }
      }

      const currentTable = await Table.findById(id);

      if (!currentTable) {
        return res.status(404).json({ error: "Table not found" });
      }

      const existingTable = await Table.findOne({
        _id: { $ne: id },
        restaurant_id: currentTable.restaurant_id,
        table_number: updates.table_number,
      });

      if (existingTable) {
        return res.status(400).json({
          error:
            "Table with this table number already exists for this restaurant",
        });
      }

      const updatedTable = await Table.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedTable) {
        return res.status(404).json({ error: "Table not found" });
      }
      res.status(200).json(updatedTable);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = tableController;
