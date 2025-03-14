require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("../models/Order");

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = process.env.NOWPAYMENTS_API_URL;
const YOUR_DOMAIN = process.env.DOMAIN;

// Route to create a NowPayments crypto payment
router.post("/create-crypto-payment", async (req, res) => {
  try {
    const { line_items, order_description, shippingInfo, pay_currency } = req.body;

    if (!req.body.shippingInfo) {
      return res.status(400).json({ error: "Missing shippingInfo object" });
    }

    const orderID = "CRYPTO-" + Date.now();
    const email = req.body.shippingInfo?.email.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const totalAmountUSD = line_items.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount / 100) * (item.quantity || 1);
    }, 0);

    if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "Missing required fields: shippingInfo" });
    }

    // Create an order with pending status
    const order = new Order({
      orderID,
      order_description,
      shippingInfo: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
      },
      totalPrice: totalAmountUSD,
      orderStatus: "Pending",
      warranty: "2 years",
      shippingPolicy: "Free shipping on orders above $500",
      customerSupport: "24/7 Customer support via Live chat and Telegram",
    });

    const savedOrder = await order.save();

    // Create a payment request on NowPayments
    const paymentRequestData = {
      price_amount: totalAmountUSD,
      price_currency: "usd",
      ipn_callback_url: `${YOUR_DOMAIN}/api/crypto/webhook`,
      order_id: savedOrder._id.toString(),
      order_description,
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/canceled`,
      is_fixed_rate: true,
      is_fee_paid_by_user: false
    };

    const paymentResponse = await axios.post(
      `${NOWPAYMENTS_API_URL}/payment`,
      paymentRequestData,
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paymentResponse.data || !paymentResponse.data.payment_id) {
      return res
        .status(500)
        .json({ message: "Failed to create crypto payment" });
    }

    // Save the payment ID
    savedOrder.payment_id = paymentResponse.data.payment_id;
    await savedOrder.save();

    const invoice_url = `https://nowpayments.io/payment/?iid=${paymentResponse.data.payment_id}`;

    res.json({
      invoice_url,
      payment_status: paymentResponse.data.payment_status,
      order_id: paymentResponse.data.order_id,
      payment_currency: paymentResponse.data.pay_currency,
      payment_amount: paymentResponse.data.pay_amount,
      payment_address: paymentResponse.data.pay_address,
      payment_id: paymentResponse.data.payment_id,
    });
  } catch (error) {
    console.error(
      "Error processing crypto payment:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Failed to create crypto payment",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Webhook to handle NowPayments payment status updates
router.post("/webhook", async (req, res) => {
  try {
    const { payment_id, payment_status, order_id } = req.body;

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
    console.error("Error handling webhook:", error.stack);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
