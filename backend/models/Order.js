const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true },
    order_description: { type: String },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending" },
    warranty: { type: String },
    shippingPolicy: { type: String },
    customerSupport: { type: String },
    stripe_session_id: { type: String }, // Not required initially
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
