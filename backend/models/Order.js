const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String },
      country: { type: String },
      state: { type: String },
      deliveryAddress: { type: String },
    },
    products: [
      {
        productID: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shippingInfo: {
      countryOfDelivery: { type: String },
      stateOfDelivery: { type: String },
      deliveryAddress: { type: String },
      intendedUse: { type: String },
    },
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
