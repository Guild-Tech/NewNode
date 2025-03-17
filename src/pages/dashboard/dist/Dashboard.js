"use strict";
exports.__esModule = true;
exports.useProducts = void 0;
// import { DashboardLayout } from "@/components/layout/Dashboard";
// import { SectionHeader } from "@/components/ui/SectionHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var ProductContext_1 = require("../../context/ProductContext");
var Dashboard_1 = require("../../components/layout/Dashboard");
var SectionHeader_1 = require("../../components/ui/SectionHeader");
var button_1 = require("../../components/ui/button");
var card_1 = require("../../components/ui/card");
var ProductCard_1 = require("../../components/products/ProductCard");
// import { useProducts } from "@/context/ProductContext";
// import { ProductCard } from "@/components/products/ProductCard";
exports.useProducts = function () {
    var context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
var Dashboard = function () {
    var products = exports.useProducts().products;
    var latestProducts = products.slice(0, 3);
    var totalProducts = products.length;
    var averagePrice = products.length
        ? products.reduce(function (sum, product) { return sum + product.price; }, 0) / products.length
        : 0;
    var totalOptions = products.reduce(function (sum, product) {
        return sum + product.cpuOptions + product.ramOptions + product.storageOptions;
    }, 0);
    return (React.createElement(Dashboard_1.DashboardLayout, null,
        React.createElement("div", { className: "space-y-8" },
            React.createElement(SectionHeader_1.SectionHeader, { title: "Dashboard", description: "Welcome to your product management dashboard", action: React.createElement(button_1.Button, { asChild: true },
                    React.createElement(react_router_dom_1.Link, { to: "/products/new" },
                        React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }),
                        "Add Product")) }),
            React.createElement("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4" },
                React.createElement(card_1.Card, { className: "bg-blue-50" },
                    React.createElement(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                        React.createElement(card_1.CardTitle, { className: "text-sm font-medium" }, "Total Products"),
                        React.createElement(lucide_react_1.Package, { className: "h-4 w-4 text-blue-500" })),
                    React.createElement(card_1.CardContent, null,
                        React.createElement("div", { className: "text-2xl font-bold" }, totalProducts))),
                React.createElement(card_1.Card, { className: "bg-green-50" },
                    React.createElement(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                        React.createElement(card_1.CardTitle, { className: "text-sm font-medium" }, "Avg. Price"),
                        React.createElement(lucide_react_1.ShoppingBag, { className: "h-4 w-4 text-green-500" })),
                    React.createElement(card_1.CardContent, null,
                        React.createElement("div", { className: "text-2xl font-bold" },
                            "$",
                            averagePrice.toFixed(2)))),
                React.createElement(card_1.Card, { className: "bg-purple-50" },
                    React.createElement(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                        React.createElement(card_1.CardTitle, { className: "text-sm font-medium" }, "Customization Options"),
                        React.createElement(lucide_react_1.Gift, { className: "h-4 w-4 text-purple-500" })),
                    React.createElement(card_1.CardContent, null,
                        React.createElement("div", { className: "text-2xl font-bold" }, totalOptions))),
                React.createElement(card_1.Card, { className: "bg-amber-50" },
                    React.createElement(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                        React.createElement(card_1.CardTitle, { className: "text-sm font-medium" }, "Unique Components"),
                        React.createElement(lucide_react_1.Cpu, { className: "h-4 w-4 text-amber-500" })),
                    React.createElement(card_1.CardContent, null,
                        React.createElement("div", { className: "text-2xl font-bold" }, products.reduce(function (sum, p) { return sum + p.cpuOptions.length; }, 0))))),
            React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("h3", { className: "text-lg font-medium" }, "Latest Products"),
                    React.createElement(button_1.Button, { variant: "outline", asChild: true, size: "sm" },
                        React.createElement(react_router_dom_1.Link, { to: "/products" }, "View all"))),
                latestProducts.length > 0 ? (React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, latestProducts.map(function (product) { return (React.createElement(ProductCard_1.ProductCard, { key: product.id, product: product })); }))) : (React.createElement(card_1.Card, { className: "bg-muted/20" },
                    React.createElement(card_1.CardContent, { className: "flex flex-col items-center justify-center py-6" },
                        React.createElement(lucide_react_1.Package, { className: "h-8 w-8 text-muted-foreground mb-2" }),
                        React.createElement("p", { className: "text-muted-foreground mb-4" }, "No products yet"),
                        React.createElement(button_1.Button, { asChild: true },
                            React.createElement(react_router_dom_1.Link, { to: "/products/new" },
                                React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }),
                                "Add New Product")))))))));
};
exports["default"] = Dashboard;
