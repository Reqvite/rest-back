const { Schema, model } = require("mongoose");

const cookSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/.test(password);
      },
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be between 8 and 30 characters long."
    }
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "Restaurant_id is required"]
  },
  phone: {
    type: String,
    required: [true, "Phone is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  address: {
    type: String,
    required: [true, "Address is required"]
  },
  picture: {
    type: String
  }
});

const Cook = model("Cook", cookSchema);

module.exports = Cook;
