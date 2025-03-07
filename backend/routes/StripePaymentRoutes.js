require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

const YOUR_DOMAIN = process.env.DOMAIN;

// Route to create a Stripe checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { line_items, order_description, shippingDetails } = req.body;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ message: "Invalid product details" });
    }

    // Calculate total price
    const totalAmount =
      line_items.reduce((sum, item) => {
        if (
          !item ||
          !item.price_data ||
          typeof item.price_data.unit_amount !== "number"
        ) {
          console.error("Invalid item structure:", item);
          return sum; // Skip invalid items
        }

        return sum + item.price_data.unit_amount * (item.quantity || 1);
      }, 0) / 100;

    // Generate a unique order ID (for demo, using timestamp)
    const orderID = "ORD" + Date.now();

    // Create a new order in the database with 'pending' payment status
    const order = new Order({
      orderID,
      order_description,
      shippingInfo: shippingDetails,
      totalPrice: totalAmount,
      orderStatus: "Pending",
      warranty: "2 years",
      shippingPolicy: "Free shipping on orders above $500",
      customerSupport: "24/7 Customer support via Live chat and Telegram",
    });

    const savedOrder = await order.save();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      submit_type: "pay",
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      line_items,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/canceled`,
      metadata: { order_id: savedOrder._id.toString(), order_description },
    });

    // Update order with the Stripe session ID
    savedOrder.stripe_session_id = session.id;
    await savedOrder.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout Session Error:", error);
    res.status(500).json({
      message: "Error creating checkout session",
      error: error.message,
    });
  }
});

// Stripe Webhook to handle payment success and update order details
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      // Verify the webhook signature using your Stripe signing secret
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        console.log("Session data:", session);

        // Retrieve shipment details from session
        const shipmentDetails = session.customer_details?.address || {};

        console.log("Shipment Details:", shipmentDetails);

        // Find the order in the database using metadata
        const order = await Order.findOne({ _id: session.metadata.order_id });

        if (!order) {
          console.error("Order not found for session:", session.id);
          return res.status(404).send("Order not found");
        }

        // Update order with shipment details and mark as completed
        order.shippingInfo = shipmentDetails;
        order.orderStatus = "Completed";

        const savedOrder = await order.save();

        res.status(200).json({ received: true });
      } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).send("Internal Server Error");
      }
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;
