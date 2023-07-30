const { Table } = require("../models");

const tableController = {
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
