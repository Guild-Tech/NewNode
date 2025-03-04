require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51QnhLvFHwL9JgzZgJT6Jnw2kXU3b2fEVHirdxoKgJ9OEsv0sh39fjAsJtz47HYYnhlBWvMQTRMeFy1Ghun5rg2JW00OCibNoa4");
const Order = require("../models/Order");

const YOUR_DOMAIN = "http://localhost:5173";

// Create Checkout Session & Store Order
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { line_items, customer_email } = req.body;
    console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);


    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ message: "Invalid product details" });
    }

    // Calculate total price
    const totalAmount = line_items.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0) / 100;

    // Create a new order in the database with 'pending' payment status
    const order = new Order({
      customer_email,
      products: line_items.map((item) => ({
        name: item.price_data.product_data.name,
        price: item.price_data.unit_amount / 100,
        quantity: item.quantity,
      })),
      total_amount: totalAmount,
      stripe_session_id: null, // Will update later
      payment_status: "pending",
    });

    const savedOrder = await order.save();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email,
      submit_type: "pay",
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      line_items,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/canceled`,
      metadata: { order_id: savedOrder._id.toString() }, // Attach order ID to session
    });

    // Update order with the Stripe session ID
    savedOrder.stripe_session_id = session.id;
    await savedOrder.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout Session Error:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
});

module.exports = router;