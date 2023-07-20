const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema(
  {
    table_number: {
      type: Number,
      required: [true, "Table number is required"],
      min: 1,
      max: 999,
      validate: {
        validator: function (value) {
          return /^[1-9]\d*$/.test(value);
        },
        message: '{VALUE} is not a valid non-negative integer.',
      },
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
      max: [10, "Seats number must not exceed 10"],
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant ID is required"],
    },
  },
  { versionKey: false, timestamps: false }
);

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

tableSchema.index({ restaurant_id: 1, table_number: 1 }, { unique: true });

const Table = mongoose.model("Table", tableSchema);
module.exports = Table;
