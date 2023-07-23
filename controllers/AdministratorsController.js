const administratorsController = {
  getDishes: (req, res) => {
    res.send("getDishes");
  },
  addDish: (req, res) => {
    res.send("addDish");
  },
  updateDish: (req, res) => {
    res.send("updateDish");
  },
  deleteDish: (req, res) => {
    res.send("deleteDish");
  },
  getPersonnel: (req, res) => {
    res.send("getPersonnel");
  },
  addPersonnel: (req, res) => {
    res.send("addPersonnel");
  },
  updatePersonnel: (req, res) => {
    res.send("updatePersonnel");
  },
  deletePersonnel: (req, res) => {
    res.send("deletePersonnel");
  },
};

module.exports = administratorsController;
