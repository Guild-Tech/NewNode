    "use strict";
exports.__esModule = true;
exports.ProductCard = void 0;
var react_router_dom_1 = require("react-router-dom");
var card_1 = require("../../components/ui/card");
var button_1 = require("../../components/ui/button");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var alert_dialog_1 = require("../../components/ui/alert-dialog");
var ProductContext_1 = require("../../context/ProductContext");
var utils_1 = require("../../utils/utils");
function ProductCard(_a) {
    var product = _a.product, className = _a.className;
    var _b = react_1.useState(false), showDeleteDialog = _b[0], setShowDeleteDialog = _b[1];
    var deleteProduct = ProductContext_1.useProducts().deleteProduct;
    var handleDelete = function () {
        deleteProduct(product.id);
        setShowDeleteDialog(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(card_1.Card, { className: utils_1.cn("overflow-hidden transition-all duration-300 hover:shadow-md group", className) },
            React.createElement("div", { className: "aspect-[16/9] overflow-hidden bg-secondary/20" },
                React.createElement("img", { src: product.image, alt: product.name, className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" })),
            React.createElement(card_1.CardContent, { className: "p-4" },
                React.createElement("div", { className: "flex justify-between items-start" },
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-medium text-lg" }, product.name),
                        React.createElement("p", { className: "text-sm text-muted-foreground line-clamp-2 mt-1" }, product.description)),
                    React.createElement("div", { className: "bg-primary px-2 py-1 rounded-full text-xs font-medium" },
                        "$",
                        product.price)),
                React.createElement("div", { className: "mt-4 grid grid-cols-3 gap-2 text-xs" },
                    React.createElement("div", { className: "flex flex-col" },
                        React.createElement("span", { className: "text-muted-foreground" }, "CPU Options"),
                        React.createElement("span", { className: "font-medium" }, product.cpuOptions)),
                    React.createElement("div", { className: "flex flex-col" },
                        React.createElement("span", { className: "text-muted-foreground" }, "RAM Options"),
                        React.createElement("span", { className: "font-medium" }, product.ramOptions)),
                    React.createElement("div", { className: "flex flex-col" },
                        React.createElement("span", { className: "text-muted-foreground" }, "Storage"),
                        React.createElement("span", { className: "font-medium" }, product.storageOptions)))),
            React.createElement(card_1.CardFooter, { className: "p-4 pt-0 flex gap-2" },
                React.createElement(button_1.Button, { asChild: true, variant: "outline", size: "sm", className: "flex-1" },
                    React.createElement(react_router_dom_1.Link, { to: "/products/edit/" + product.id },
                        React.createElement(lucide_react_1.Pencil, { className: "h-4 w-4 mr-2" }),
                        "Edit")),
                React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200", onClick: function () { return setShowDeleteDialog(true); } },
                    React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4 mr-2" }),
                    "Delete"))),
        React.createElement(alert_dialog_1.AlertDialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog },
            React.createElement(alert_dialog_1.AlertDialogContent, { className: "glass-panel" },
                React.createElement(alert_dialog_1.AlertDialogHeader, null,
                    React.createElement(alert_dialog_1.AlertDialogTitle, null, "Are you sure?"),
                    React.createElement(alert_dialog_1.AlertDialogDescription, null,
                        "This will permanently delete the product \"",
                        product.name,
                        "\". This action cannot be undone.")),
                React.createElement(alert_dialog_1.AlertDialogFooter, null,
                    React.createElement(alert_dialog_1.AlertDialogCancel, null, "Cancel"),
                    React.createElement(alert_dialog_1.AlertDialogAction, { onClick: handleDelete, className: "bg-red-500 hover:bg-red-600 text-white" }, "Delete"))))));
}
exports.ProductCard = ProductCard;
