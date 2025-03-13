import { useState } from "react";
// import { useWeb3Modal } from '@web3modal/react';
// import { useAccount } from "wagmi";
//import DePay from '@depay/web3-payments';
import { Wallet } from "lucide-react";
import { retrieveSystemInfoAsText } from "../../utils/convert to plainaText";
import { useCartStore } from "../../store/cartStore";
// import { v4 as uuidv4 } from "uuid";
import { ShipmentFormData } from "./ShipmentDetails";

interface CryptoPaymentProps {
  amount: number;
  email: string;
  shippingDetails: ShipmentFormData | null; // Add this prop
  shipmentData: ShipmentFormData;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function CryptoPayment({
  amount,
  email,
  shippingDetails,
  shipmentData,
  onSuccess,
  onError,
}: CryptoPaymentProps) {
  // const { open } = useWeb3Modal();
  // const { isConnected } = useAccount();
  const [invoice_url, setInvoiceUrl] = useState<{
    invoice_url: string;
    message: string;
    payment_id:string
  }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice } = useCartStore();
  const [error, setError] = useState(false);
  const order_description = `${retrieveSystemInfoAsText(
    items
  )}Total Price: ${getTotalPrice()}`;
  // const order_id = uuidv4();

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    setError(false);
    console.log("response")

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-crypto-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_email: email,
            order_description,
            shipping_details: shippingDetails,
            price_currency: "ETH",
            pay_currency: "ETH",
            customer: {
              name: `${shipmentData?.firstName} ${shipmentData?.lastName}`,
              email: shipmentData?.email,
              phone: shipmentData?.phone,
            },
            line_items: [
              {
                price_data: {
                  product_data: { name: "Product Name" },
                  unit_amount: amount * 100,
                },
                quantity: 1,
              },
            ],
          }),
        }
      );

      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON response:", text);
        setError(true);
        return;
      }

      setInvoiceUrl({
        invoice_url: data.url,
        message: "Redirecting to payment page",
        payment_id: data.payment_id,
      });
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  console.log(invoice_url);

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-semibold">Crypto Payment</h3>
        </div>
        <span className="text-xl font-bold">${amount}</span>
      </div>

      {/* {!isConnected && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Please connect your wallet to proceed with the payment
          </p>
        </div>
      )} */}

      {invoice_url?.invoice_url ? (
        <>
          <a
            target="_blank"
            href={`${invoice_url?.invoice_url}`}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            Continue
          </a>
          <span className="text-xs text-gray-500">
            you will be redirected to the payment page
          </span>
        </>
      ) : (
        <button
          onClick={handleCryptoPayment}
          disabled={isProcessing || !email}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              <span>{"Pay with Crypto"}</span>
              {error && (
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75">
                  {invoice_url?.message}
                </span>
              )}
            </>
          )}
        </button>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>Accepted tokens:</p>
        <ul className="list-disc list-inside">
          <li>ETH (Ethereum)</li>
          <li>USDT (Tether)</li>
        </ul>
      </div>
    </div>
  );
}
