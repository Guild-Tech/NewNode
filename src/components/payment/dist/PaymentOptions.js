"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var CryptoPayment_1 = require("./CryptoPayment");
var ShipmentDetails_1 = require("./ShipmentDetails");
var convert_to_plainaText_1 = require("../../utils/convert to plainaText");
var cartStore_1 = require("../../store/cartStore");
function PaymentOptions(_a) {
    var _this = this;
    var amount = _a.amount, onSuccess = _a.onSuccess, shipmentData = _a.shipmentData;
    var _b = react_1.useState(null), selectedMethod = _b[0], setSelectedMethod = _b[1];
    var _c = react_1.useState(false), processing = _c[0], setProcessing = _c[1];
    var _d = react_1.useState("selection"), step = _d[0], setStep = _d[1];
    var _e = react_1.useState(null), shippingDetails = _e[0], setShippingDetails = _e[1];
    var _f = cartStore_1.useCartStore(), items = _f.items, getTotalPrice = _f.getTotalPrice;
    var order_description = convert_to_plainaText_1.retrieveSystemInfoAsText(items) + " Total Price: " + getTotalPrice();
    var handleProceedToShipping = function (method) {
        setSelectedMethod(method);
        setStep("shipping");
    };
    var handleShippingSubmit = function (details) {
        setShippingDetails(details);
        setStep("payment");
    };
    var handleCardPayment = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, url, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!shippingDetails) {
                        alert("Please enter your shipping details before proceeding.");
                        return [2 /*return*/];
                    }
                    setProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(import.meta.env.VITE_API_URL + "/create-checkout-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                order_description: order_description,
                                shippingInfo: {
                                    firstName: shippingDetails.firstName,
                                    lastName: shippingDetails.lastName,
                                    phone: shippingDetails.phone,
                                    address: shippingDetails.address,
                                    city: shippingDetails.city,
                                    state: shippingDetails.state,
                                    zipCode: shippingDetails.zipCode,
                                    country: shippingDetails.country
                                },
                                line_items: [
                                    {
                                        price_data: {
                                            currency: "usd",
                                            product_data: { name: "Product Name" },
                                            unit_amount: amount * 100
                                        },
                                        quantity: 1
                                    },
                                ]
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Failed to create checkout session");
                    return [4 /*yield*/, response.json()];
                case 3:
                    url = (_a.sent()).url;
                    window.location.href = url; // Redirect to Stripe Checkout
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    alert("An error occurred while processing the payment.");
                    return [3 /*break*/, 5];
                case 5:
                    setProcessing(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "space-y-6" },
        step === "selection" && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                React.createElement(framer_motion_1.motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: function () { return handleProceedToShipping("card"); }, disabled: processing, className: "p-6 rounded-xl border-2 transition-colors " + (selectedMethod === "card" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200") },
                    React.createElement(lucide_react_1.CreditCard, { className: "h-8 w-8 mb-4 text-green-500" }),
                    React.createElement("h3", { className: "font-semibold mb-2" }, "Credit Card"),
                    React.createElement("p", { className: "text-sm text-gray-600" }, "Secure payment via Stripe")),
                React.createElement(framer_motion_1.motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: function () { return handleProceedToShipping("crypto"); }, className: "p-6 rounded-xl border-2 transition-colors " + (selectedMethod === "crypto" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200") },
                    React.createElement(lucide_react_1.Wallet, { className: "h-8 w-8 mb-4 text-green-500" }),
                    React.createElement("h3", { className: "font-semibold mb-2" }, "Cryptocurrency"),
                    React.createElement("p", { className: "text-sm text-gray-600" }, "Pay with ETH via MetaMask"))))),
        step === "shipping" && React.createElement(ShipmentDetails_1["default"], { onSubmit: handleShippingSubmit }),
        step === "payment" && (React.createElement(framer_motion_1.AnimatePresence, null,
            selectedMethod === "card" && (React.createElement(framer_motion_1.motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handleCardPayment, disabled: processing, className: "w-full p-4 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors" }, "Proceed to Payment")),
            selectedMethod === "crypto" && (React.createElement(CryptoPayment_1["default"], { amount: amount, shippingDetails: shippingDetails, shipmentData: shipmentData, onSuccess: onSuccess, onError: function () { return alert("Crypto payment failed"); } }))))));
}
exports["default"] = PaymentOptions;
