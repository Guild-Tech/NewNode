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
// import { useWeb3Modal } from '@web3modal/react';
// import { useAccount } from "wagmi";
//import DePay from '@depay/web3-payments';
var lucide_react_1 = require("lucide-react");
var convert_to_plainaText_1 = require("../../utils/convert to plainaText");
var cartStore_1 = require("../../store/cartStore");
function CryptoPayment(_a) {
    var _this = this;
    var amount = _a.amount, shippingDetails = _a.shippingDetails, onSuccess = _a.onSuccess, onError = _a.onError;
    var _b = react_1.useState(), invoice_url = _b[0], setInvoiceUrl = _b[1];
    var _c = react_1.useState(false), isProcessing = _c[0], setIsProcessing = _c[1];
    var _d = cartStore_1.useCartStore(), items = _d.items, getTotalPrice = _d.getTotalPrice;
    var _e = react_1.useState(false), error = _e[0], setError = _e[1];
    var _f = react_1.useState("ETH"), selectedCurrency = _f[0], setSelectedCurrency = _f[1]; // Default ETH
    var order_description = convert_to_plainaText_1.retrieveSystemInfoAsText(items) + "Total Price: " + getTotalPrice();
    // const order_id = uuidv4();
    var handleCryptoPayment = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, text, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsProcessing(true);
                    setError(false);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(import.meta.env.VITE_API_URL + "/create-crypto-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                pay_currency: selectedCurrency.toUpperCase(),
                                order_description: order_description,
                                shippingInfo: {
                                    firstName: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.firstName) || "",
                                    lastName: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.lastName) || "",
                                    email: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.email) || "",
                                    phone: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.phone) || "",
                                    address: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.address) || "",
                                    city: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.city) || "",
                                    state: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.state) || "",
                                    zipCode: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.zipCode) || "",
                                    country: (shippingDetails === null || shippingDetails === void 0 ? void 0 : shippingDetails.country) || ""
                                },
                                line_items: [
                                    {
                                        price_data: {
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
                    if (!response.ok) {
                        throw new Error("HTTP error! Status: " + response.status);
                    }
                    return [4 /*yield*/, response.text()];
                case 3:
                    text = _a.sent();
                    console.log("Raw Response:", text);
                    data = void 0;
                    try {
                        data = JSON.parse(text);
                    }
                    catch (error) {
                        console.error("❌ Invalid JSON response:", text);
                        throw new Error("Invalid JSON response from server");
                    }
                    console.log("✅ Crypto Payment Response:", data);
                    if (data === null || data === void 0 ? void 0 : data.invoice_url) {
                        setInvoiceUrl({
                            invoice_url: data.invoice_url,
                            message: "Redirecting to payment page",
                            payment_id: data.id || ""
                        });
                        onSuccess();
                    }
                    else {
                        throw new Error("Missing invoice_url in response");
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    console.error("❌ Crypto Payment Error:", err_1);
                    setError(true);
                    onError(err_1.message || "An error occurred");
                    return [3 /*break*/, 6];
                case 5:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "p-6 border rounded-lg" },
        React.createElement("div", { className: "flex items-center justify-between mb-6" },
            React.createElement("div", { className: "flex items-center space-x-2" },
                React.createElement(lucide_react_1.Wallet, { className: "h-6 w-6 text-green-500" }),
                React.createElement("h3", { className: "text-lg font-semibold" }, "Crypto Payment")),
            React.createElement("span", { className: "text-xl font-bold" },
                "$",
                amount)),
        (invoice_url === null || invoice_url === void 0 ? void 0 : invoice_url.invoice_url) ? (React.createElement(React.Fragment, null,
            React.createElement("a", { target: "_blank", href: "" + (invoice_url === null || invoice_url === void 0 ? void 0 : invoice_url.invoice_url), className: "w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2" }, "Continue"),
            React.createElement("span", { className: "text-xs text-gray-500" }, "you will be redirected to the payment page"))) : (React.createElement("button", { onClick: handleCryptoPayment, disabled: isProcessing, className: "w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2" }, isProcessing ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" }),
            React.createElement("span", null, "Processing..."))) : (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.Wallet, { className: "h-5 w-5" }),
            React.createElement("span", null, "Pay with Crypto"),
            error && (React.createElement("span", { className: "animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75" }, invoice_url === null || invoice_url === void 0 ? void 0 : invoice_url.message)))))),
        React.createElement("div", { className: "mt-4 text-sm text-gray-500" },
            React.createElement("label", null, "Select Cryptocurrency:"),
            React.createElement("select", { value: selectedCurrency, onChange: function (e) { return setSelectedCurrency(e.target.value); }, className: "p-2 border rounded w-full" },
                React.createElement("option", { value: "eth" }, "Ethereum (ETH)"),
                React.createElement("option", { value: "usdt" }, "Tether (USDT)")))));
}
exports["default"] = CryptoPayment;
