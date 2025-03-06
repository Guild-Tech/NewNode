require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

const YOUR_DOMAIN = "http://localhost:5173";

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { line_items, customer_email } = req.body;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ message: "Invalid product details" });
    }

    // Calculate total price
    const totalAmount =
      line_items.reduce(
        (sum, item) => sum + item.price_data.unit_amount * item.quantity,
        0
      ) / 100;

    // Generate a unique order ID (for demo, using timestamp)
    const orderID = "ORD" + Date.now();

    // Create a new order in the database with 'pending' payment status
    const order = new Order({
      orderID,
      customer: {
        firstName: "John", // Replace with actual data if available
        lastName: "Doe",
        email: customer_email,
        phoneNumber: "",
        country: "",
        state: "",
        deliveryAddress: "",
      },
      products: line_items.map((item) => ({
        productID: item.price_data.product_id || "unknown",
        name: item.price_data.product_data.name,
        price: item.price_data.unit_amount / 100,
        quantity: item.quantity,
      })),
      shippingInfo: {
        countryOfDelivery: "United States",
        stateOfDelivery: "California",
        deliveryAddress: "123 Main St, Los Angeles, CA 90001",
        intendedUse: "Personal",
      },
      totalPrice: totalAmount,
      orderStatus: "Pending",
      warranty: "2 years",
      shippingPolicy: "Free shipping on orders above $500",
      customerSupport: "24/7 Customer support via Live chat and Telegram",
      stripe_session_id: null, // Will update after session creation
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
      metadata: { order_id: savedOrder._id.toString() },
    });

    // Update order with the Stripe session ID
    savedOrder.stripe_session_id = session.id;
    await savedOrder.save();

    res.json({ url: session.url });

    // Stripe webhook endpoint
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the webhook signature using your Stripe signing secret
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Find the order in the database using metadata
      const order = await Order.findOne({ _id: session.metadata.order_id });

      if (!order) {
        console.error("Order not found for session:", session.id);
        return res.status(404).send("Order not found");
      }

      // Update order status to 'Completed'
      order.orderStatus = "Completed";
      await order.save();

      console.log("Order updated successfully:", order._id);
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  // Respond to Stripe that the event was received successfully
  res.status(200).json({ received: true });
});
  } catch (error) {
    console.error("Checkout Session Error:", error);
    res.status(500).json({ message: "Error creating checkout session", error: error.message });
  }
});

module.exports = router;