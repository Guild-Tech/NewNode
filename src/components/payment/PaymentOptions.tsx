import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet } from "lucide-react";
import CryptoPayment from "./CryptoPayment";
import ShipmentDetails, { ShipmentFormData } from "./ShipmentDetails";
import { retrieveSystemInfoAsText } from "../../utils/convert to plainaText";
import { useCartStore } from "../../store/cartStore";

interface PaymentOptionsProps {
  amount: number;
  onSuccess: () => void;
  // shipmentData: ShipmentFormData;
}

export default function PaymentOptions({ amount, onSuccess }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "crypto" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"selection" | "shipping" | "payment">("selection");
  const [shippingDetails, setShippingDetails] = useState<ShipmentFormData | null>(null);

  const { items, getTotalPrice } = useCartStore();
  const order_description = `${retrieveSystemInfoAsText(items)} Total Price: ${getTotalPrice()}`;

  const handleProceedToShipping = (method: "card" | "crypto") => {
    setSelectedMethod(method);
    setStep("shipping");
  };

  const handleShippingSubmit = (details: ShipmentFormData) => {
    setShippingDetails(details);
    setStep("payment");
  };

  const handleCardPayment = async () => {
    if (!shippingDetails) {
      alert("Please enter your shipping details before proceeding.");
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_description,
          shippingInfo: {
            firstName: shippingDetails.firstName,
            lastName: shippingDetails.lastName,
            phone: shippingDetails.phone,
            address: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
            zipCode: shippingDetails.zipCode,
            country: shippingDetails.country,
          },
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: { name: "Product Name" },
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
      alert("An error occurred while processing the payment.");
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {step === "selection" && (
        <>
          {/* Payment Method Options */}
          <div className="grid grid-cols-2 gap-4">
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

      {step === "shipping" && <ShipmentDetails onSubmit={handleShippingSubmit} />}

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
              shippingDetails={shippingDetails}
              // shipmentData={shipmentData}
              onSuccess={onSuccess}
              onError={() => alert("Crypto payment failed")}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
