const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema(
  {
    tableNumber: {
      type: String,
      required: [true, "Table number is required"],
      match: [
        /^(?:.{0,50} )?(?:№| #)(?!0\d)\d{1,4}(?!\S)$/,
        "Invalid table number format. It should be in the format '<text> №<digits>' or '<text> #<digits>'.",
      ],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Free", "Taken", "Waiting"],
        message: "{VALUE} is not supported status",
      },
      default: "Free",
      validate: [
        {
          validator: function (value) {
            if (this.isNew && value !== "Free") {
              return false;
            }
            return true;
          },
          message:
            "Invalid status for new table. Only 'Free' status is allowed.",
          type: "new",
        },
        {
          validator: function (value) {
            if (
              this.isModified("status") &&
              this.status === "Waiting" &&
              this.previous("status") !== "Taken"
            ) {
              return false;
            }
            return true;
          },
          message:
            "Invalid status transition. Only 'Taken' status can be changed to 'Waiting'.",
          type: "transition",
        },
      ],
    },
    seats: {
      type: Number,
      required: [true, "Seats number is required"],
      min: [1, "Seats number must be at least 1"],
      max: [100, "Seats number must not exceed 100"],
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant ID is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

// Maybe it's better to move this check to the controller before saving the table.
tableSchema.pre("save", async function (next) {
  try {
    const restaurant = await mongoose
      .model("Restaurant")
      .findById(this.restaurant_id);
    if (!restaurant) {
      throw new Error(
        "Restaurant not found. Please provide a valid restaurant ID."
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Maybe it's better to move this check to the controller before saving the table.
tableSchema.index({ tableNumber: 1, restaurant_id: 1 }, { unique: true });

const Table = mongoose.model("Table", tableSchema);
module.exports = Table;
