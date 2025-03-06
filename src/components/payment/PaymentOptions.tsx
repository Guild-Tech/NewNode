import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet } from "lucide-react";
import CryptoPayment from "./CryptoPayment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  "pk_test_51QnhLvFHwL9JgzZgyBAw7V9SpqZOb5U4ZTj0Rj9Iybcw7KXpWWQ8EbzLhHf8sElzq6JAvlXzBZStaI0kKqKF0W0s00VfB19zSK"
);

interface PaymentOptionsProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentOptions({ amount, onSuccess }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "crypto" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState(""); // Capture user email

  const handleCardPayment = async () => {
    if (!email) {
      alert("Please enter your email before proceeding.");
      return;
    }
  
    setProcessing(true);
    setSelectedMethod("card");
  
    try {
      const response = await fetch("http://localhost:4000/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: email, // Ensure the email is passed correctly
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: { name: "Custom Product" },
                unit_amount: amount * 100, // Amount must be in cents
              },
              quantity: 1,
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
  
      const { url } = await response.json();
      window.location.href = url; // Redirect user to Stripe Checkout
    } catch (error) {
      console.error("Payment failed:", error);
      alert("An error occurred while processing the payment.");
    }
    setProcessing(false);
  };
  

  return (
    <div className="space-y-6">
      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 font-medium">
          Email:
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
          disabled={processing}
        />
      </div>

      {/* Payment Method Options */}
      <div className="grid grid-cols-2 gap-4">
        {/* Credit Card Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCardPayment}
          disabled={processing}
          className={`p-6 rounded-xl border-2 transition-colors ${
            selectedMethod === "card" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200"
          }`}
        >
          <CreditCard className="h-8 w-8 mb-4 text-green-500" />
          <h3 className="font-semibold mb-2">Credit Card</h3>
          <p className="text-sm text-gray-600">Secure payment via Stripe</p>
        </motion.button>

        {/* Cryptocurrency Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMethod("crypto")}
          className={`p-6 rounded-xl border-2 transition-colors ${
            selectedMethod === "crypto" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200"
          }`}
        >
          <Wallet className="h-8 w-8 mb-4 text-green-500" />
          <h3 className="font-semibold mb-2">Cryptocurrency</h3>
          <p className="text-sm text-gray-600">Pay with ETH via MetaMask</p>
        </motion.button>
      </div>

      {/* Render Crypto Payment Option if selected */}
      <AnimatePresence>
        {selectedMethod === "crypto" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <CryptoPayment
              amount={amount}
              onSuccess={onSuccess}
              onError={() => alert("Crypto payment failed")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}