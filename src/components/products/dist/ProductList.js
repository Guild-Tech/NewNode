"use strict";
exports.__esModule = true;
exports.ProductList = void 0;
var ProductContext_1 = require("../../context/ProductContext");
var ProductCard_1 = require("./ProductCard");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("../../components/ui/button");
var lucide_react_1 = require("lucide-react");
function ProductList() {
    var products = ProductContext_1.useProducts().products;
    if (!Array.isArray(products)) {
        console.error("Expected an array but got:", products);
        return React.createElement("p", null, "Error: Products data is invalid.");
    }
    if (products.length === 0) {
        return (React.createElement("div", { className: "flex flex-col items-center justify-center h-[50vh] glass-panel rounded-xl p-8" },
            React.createElement(lucide_react_1.Package, { className: "h-16 w-16 text-muted-foreground mb-4" }),
            React.createElement("h3", { className: "text-xl font-medium mb-2" }, "No products yet"),
            React.createElement("p", { className: "text-muted-foreground text-center max-w-sm mb-6" }, "Get started by creating your first product. You can add details, images, and customization options."),
            React.createElement(button_1.Button, { asChild: true },
                React.createElement(react_router_dom_1.Link, { to: "/products/new" },
                    React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }),
                    "Add New Product"))));
    }
    return (React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, products.map(function (product) { return (React.createElement(ProductCard_1.ProductCard, { key: product.id, product: product })); })));
}
exports.ProductList = ProductList;
