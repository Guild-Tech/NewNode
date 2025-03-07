import { useState } from 'react';
// import { useWeb3Modal } from '@web3modal/react';
//import DePay from '@depay/web3-payments';
import { Wallet } from 'lucide-react';
import { retrieveSystemInfoAsText } from '../../utils/convert to plainaText';
import { useCartStore } from '../../store/cartStore';
import { v4 as uuidv4 } from 'uuid';

interface CryptoPaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function CryptoPayment({
  amount,
  onSuccess,
  onError,
}: CryptoPaymentProps) {
  // const { open } = useWeb3Modal();
  // const { isConnected } = useAccount();
  const [invoice_url, setInvoiceUrl] = useState<{ invoice_url: string, message: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice } = useCartStore();
  const [error, setError] = useState(false);
  const order_description = (`${retrieveSystemInfoAsText(items)}Total Price: ${getTotalPrice()}`)
  const order_id = uuidv4();

  const handlePayment = () => {
    setIsProcessing(true);
    setError(false);


    // Initialize DePay Widget
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", import.meta.env.VITE_PAYMENT_API);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "price_amount": amount,
      "price_currency": "usd",
      "order_id": `${order_id.toString()}`,
      "order_description": `${order_description.toString()}`,
      "ipn_callback_url": "https://nowpayments.io",
      "success_url": "https://nowpayments.io",
      "cancel_url": "https://nowpayments.io",
      // "customer_email": `${email.toString()}`,
      // "name": `${name}`,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.nowpayments.io/v1/invoice", requestOptions as any)
      .then(response => response.json())
      .then(result => {
        setInvoiceUrl(result);
        setIsProcessing(false);
        console.log(result)
      })
      .catch(error => {
        setError(true);
        console.log('error', error)
        // alert(error?.message || 'Something went wrong. Please try again.');
      });
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

      {invoice_url?.invoice_url ? (
        <>
          <a target='_blank' href={`${invoice_url?.invoice_url}`} className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2">Continue</a>
          <span className="text-xs text-gray-500">you will be redirected to the payment page</span>
        </>
      ) : <button
        onClick={handlePayment}
        disabled={isProcessing}
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
            {error && <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75">{invoice_url?.message}</span>}
          </>
        )}
      </button>}

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
