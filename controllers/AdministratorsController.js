const administratorsController = {
  getPersonnelByRestaurantId: (req, res) => {
    res.send("getPersonnelByRestaurantId");
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
