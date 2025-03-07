require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("../models/Order");

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = process.env.NOWPAYMENTS_API_URL;
const YOUR_DOMAIN = "process.env.DOMAIN";

// Route to create a NowPayments crypto payment
router.post("/create-crypto-payment", async (req, res) => {
  try {
    const { amount, currency, customer_email, order_description } = req.body;

    if (!amount || !currency || !customer_email) {
      return res.status(400).json({ message: "Invalid payment details" });
    }

    const orderID = "CRYPTO-" + Date.now();

    console.log("Received Crypto Payment Data:", req.body);

    // Create an order with pending status
    const order = new Order({
      orderID,
      order_description,
      customer: {
        firstName: "",
        lastName: "",
        email: customer_email,
        phoneNumber: "",
        country: "",
        state: "",
        deliveryAddress: "",
      },
      shippingInfo: {
        countryOfDelivery: "",
        stateOfDelivery: "",
        deliveryAddress: "",
        intendedUse: "Personal",
      },
      totalPrice: amount,
      currency,
      orderStatus: "Pending",
      paymentGateway: "NowPayments",
    });

    const savedOrder = await order.save();

    // Create a payment request on NowPayments
    const paymentResponse = await axios.post(
      `${NOWPAYMENTS_API_URL}/payment`,
      {
        price_amount: amount,
        price_currency: currency,
        pay_currency: "BTC", // Default to Bitcoin (you can change this)
        ipn_callback_url: `${YOUR_DOMAIN}/api/crypto/webhook`,
        order_id: savedOrder._id.toString(),
        order_description,
        customer_email,
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/canceled`,
      },
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("NowPayments Response:", paymentResponse.data);

    if (!paymentResponse.data || !paymentResponse.data.invoice_url) {
      return res.status(500).json({ message: "Failed to create crypto payment" });
    }

    // Save the payment ID
    savedOrder.payment_id = paymentResponse.data.payment_id;
    await savedOrder.save();

    res.json({ url: paymentResponse.data.invoice_url });
  } catch (error) {
    console.error("Crypto Payment Error:", error);
    res.status(500).json({ message: "Error creating crypto payment", error: error.message });
  }
});

// Webhook to handle NowPayments payment status updates
router.post("/webhook", async (req, res) => {
  try {
    const { payment_id, payment_status, order_id } = req.body;

    console.log("Received Webhook Data:", req.body);

    if (!payment_id || !payment_status || !order_id) {
      return res.status(400).json({ message: "Invalid webhook data" });
    }

    // Find the order in the database
    const order = await Order.findOne({ _id: order_id });

    if (!order) {
      console.error("Order not found for payment_id:", payment_id);
      return res.status(404).send("Order not found");
    }

    // Update order status based on payment status
    if (payment_status === "confirmed" || payment_status === "finished") {
      order.orderStatus = "Completed";
    } else if (payment_status === "failed" || payment_status === "expired") {
      order.orderStatus = "Failed";
    } else if (payment_status === "waiting" || payment_status === "pending") {
      order.orderStatus = "Pending";
    }

    await order.save();

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
