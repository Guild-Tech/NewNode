import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet } from "lucide-react";
import CryptoPayment from "./CryptoPayment";
import ShipmentDetails, { ShipmentFormData } from "./ShipmentDetails";
import { retrieveSystemInfoAsText } from '../../utils/convert to plainaText';
import { useCartStore } from '../../store/cartStore';

interface PaymentOptionsProps {
  amount: number;
  onSuccess: () => void;
  shipmentData: ShipmentFormData;
}

export default function PaymentOptions({ amount, onSuccess, shipmentData }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "crypto" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"selection" | "shipping" | "payment">("selection");
  const [shippingDetails, setShippingDetails] = useState<ShipmentFormData | null>(null);
  
  const { items, getTotalPrice } = useCartStore();
  const order_description = (`${retrieveSystemInfoAsText(items)} Total Price: ${getTotalPrice()}`);

  const handleProceedToShipping = (method: "card" | "crypto") => {
    setSelectedMethod(method);
    setStep("shipping");
  };

  const handleShippingSubmit = (details: ShipmentFormData) => {
    setShippingDetails(details);
    setStep("payment");
  };

  const handleCardPayment = async () => {
    if (!email || !shippingDetails) {
      alert("Please enter your email and shipping details before proceeding.");
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch("http://localhost:4000/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: email,
          order_description,
          shipping_details: shippingDetails,
          customer: {
            name: `${shipmentData?.firstName} ${shipmentData?.lastName}`,
            email: shipmentData?.email,
            phone: shipmentData?.phone,
          },
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: { name: 'Product Name' },
                unit_amount: amount * 100,
              },
              quantity: 1,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Payment failed:", error);
      alert("An error occurred while processing the payment.");
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {step === "selection" && (
        <>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">Email:</label>
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
            {/* Credit Card Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProceedToShipping("card")}
              disabled={processing}
              className={`p-6 rounded-xl border-2 transition-colors ${
                selectedMethod === "card" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200"
              }`}
            >
              <CreditCard className="h-8 w-8 mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Credit Card</h3>
              <p className="text-sm text-gray-600">Secure payment via Stripe</p>
            </motion.button>

            {/* Cryptocurrency Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProceedToShipping("crypto")}
              className={`p-6 rounded-xl border-2 transition-colors ${
                selectedMethod === "crypto" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200"
              }`}
            >
              <Wallet className="h-8 w-8 mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Cryptocurrency</h3>
              <p className="text-sm text-gray-600">Pay with ETH via MetaMask</p>
            </motion.button>
          </div>
        </>
      )}

      {/* Shipping Details Form */}
      {step === "shipping" && (
        <ShipmentDetails onSubmit={handleShippingSubmit} />
      )}

      {/* Process Payment */}
      {step === "payment" && (
        <AnimatePresence>
          {selectedMethod === "card" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCardPayment}
              disabled={processing}
              className="w-full p-4 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
            >
              Proceed to Payment
            </motion.button>
          )}

          {selectedMethod === "crypto" && (
            <CryptoPayment
              amount={amount}
              onSuccess={onSuccess}
              onError={() => alert("Crypto payment failed")}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}