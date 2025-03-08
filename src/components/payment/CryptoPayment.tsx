import { useState } from 'react';
// import { useWeb3Modal } from '@web3modal/react';
//import DePay from '@depay/web3-payments';
import { Wallet } from 'lucide-react';
import { retrieveSystemInfoAsText } from '../../utils/convert to plainaText';
import { useCartStore } from '../../store/cartStore';


interface CryptoPaymentProps {
  amount: number;
  email: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function CryptoPayment({
  amount,
  email,
  onSuccess,
  onError,
}: CryptoPaymentProps) {
  // const { open } = useWeb3Modal();
  // const { isConnected } = useAccount();
  const [invoice_url, setInvoiceUrl] = useState<{ invoice_url: string, message: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice } = useCartStore();
  const [error, setError] = useState(false);
  const order_description = (`${retrieveSystemInfoAsText(items)} Total Price: ${getTotalPrice()}`)
  // const order_id = uuidv4();

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(false);
    console.log("response")

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-crypto-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "USD",
          customer_email: email,
          order_description: order_description,
        }),
      });
      console.log(response)
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment");
      }

      setInvoiceUrl(data.url);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };


  console.log(invoice_url)

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

      {invoice_url !== undefined ? (
        <a href={"invoice_url"} target="_blank" rel="noopener noreferrer" className="btn-primary">
          Proceed to Payment
        </a>
      ) : (
        <button onClick={handlePayment} disabled={isProcessing || !email} className="btn-primary">
          {isProcessing ? "Processing..." : "Pay with Crypto"}
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
