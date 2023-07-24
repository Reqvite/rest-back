const tableController = {
  getTablesByRestaurantId: (req, res) => {
    res.send("getTablesByRestaurantId");
  },
  getTable: (req, res) => {
    res.send("getTable");
  },
  updateTable: (req, res) => {
    res.send("updateTable");
  },
};

module.exports = tableController;
