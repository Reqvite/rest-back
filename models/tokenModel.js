const { Schema, model } = require("mongoose");

const TokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    tokenId: { type: String, required: true },
    expire: { type: Number, required: true }
  },
  { collection: "tokens" }
);

TokenSchema.index({ userId: 1 }, { unique: true });

const Token = model("Token", TokenSchema);

module.exports = {
  Token
};
