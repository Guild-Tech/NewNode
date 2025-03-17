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
var date_fns_1 = require("date-fns");
var table_1 = require("../../components/ui/table");
var OrderStatusBadge_1 = require("../../components/orders/OrderStatusBadge");
var OrderStatusSelect_1 = require("../../components/orders/OrderStatusSelect");
var card_1 = require("../../components/ui/card");
var Sidebar_1 = require("../../components/layout/Sidebar");
function Orders() {
    var _this = this;
    var _a = react_1.useState([]), orders = _a[0], setOrders = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    // Fetch orders from the backend
    react_1.useEffect(function () {
        var fetchOrders = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch('/api/orders')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to fetch orders');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setOrders(data);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        setError(err_1.message);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchOrders();
    }, []);
    return (react_1["default"].createElement("div", { className: "flex min-h-screen bg-gray-50" },
        react_1["default"].createElement(Sidebar_1.Sidebar, null),
        react_1["default"].createElement("div", { className: "flex-1 ml-64 p-8" },
            react_1["default"].createElement("div", { className: "max-w-6xl mx-auto" },
                react_1["default"].createElement("h1", { className: "text-3xl font-bold tracking-tight mb-6" }, "Orders"),
                react_1["default"].createElement(card_1.Card, null,
                    react_1["default"].createElement(card_1.CardHeader, null,
                        react_1["default"].createElement(card_1.CardTitle, null, "All Orders"),
                        react_1["default"].createElement(card_1.CardDescription, null, "Manage customer orders and their statuses")),
                    react_1["default"].createElement(card_1.CardContent, null, loading ? (react_1["default"].createElement("p", null, "Loading orders...")) : error ? (react_1["default"].createElement("p", { className: "text-red-500" },
                        "Error: ",
                        error)) : orders.length === 0 ? (react_1["default"].createElement("p", null, "No orders found.")) : (react_1["default"].createElement(table_1.Table, null,
                        react_1["default"].createElement(table_1.TableHeader, null,
                            react_1["default"].createElement(table_1.TableRow, null,
                                react_1["default"].createElement(table_1.TableHead, null, "Order ID"),
                                react_1["default"].createElement(table_1.TableHead, null, "Customer"),
                                react_1["default"].createElement(table_1.TableHead, null, "Date"),
                                react_1["default"].createElement(table_1.TableHead, null, "Amount"),
                                react_1["default"].createElement(table_1.TableHead, null, "Status"),
                                react_1["default"].createElement(table_1.TableHead, null, "Update Status"))),
                        react_1["default"].createElement(table_1.TableBody, null, orders.map(function (order) { return (react_1["default"].createElement(table_1.TableRow, { key: order.id },
                            react_1["default"].createElement(table_1.TableCell, { className: "font-medium" },
                                "#",
                                order.id),
                            react_1["default"].createElement(table_1.TableCell, null,
                                react_1["default"].createElement("div", null, order.customerName),
                                react_1["default"].createElement("div", { className: "text-xs text-gray-500" }, order.customerEmail)),
                            react_1["default"].createElement(table_1.TableCell, null, date_fns_1.format(new Date(order.createdAt), 'MMM dd, yyyy')),
                            react_1["default"].createElement(table_1.TableCell, null,
                                "$",
                                order.totalAmount.toFixed(2)),
                            react_1["default"].createElement(table_1.TableCell, null,
                                react_1["default"].createElement(OrderStatusBadge_1.OrderStatusBadge, { status: order.status })),
                            react_1["default"].createElement(table_1.TableCell, null,
                                react_1["default"].createElement(OrderStatusSelect_1.OrderStatusSelect, { orderId: order.id, currentStatus: order.status })))); }))))))))));
}
exports["default"] = Orders;
