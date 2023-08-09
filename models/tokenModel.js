const { Schema, model } = require('mongoose');

const TokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token_id: { type: String, required: true },
    token: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expire: { type: Number, required: true },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'cook', 'waiter'],
    },
  },
  { collection: 'tokens' }
);

TokenSchema.index({ user_id: 1 }, { unique: true });

const Token = model('Token', TokenSchema);

module.exports = Token;
