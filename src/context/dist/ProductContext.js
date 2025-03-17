"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ProductProvider = void 0;
var react_1 = require("react");
var axios_1 = require("axios");
var sonner_1 = require("sonner");
var ProductContext = react_1.createContext(null);
// Reducer to manage product state
var productReducer = function (state, action) {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return action.payload;
        case 'ADD_PRODUCT':
            return __spreadArrays(state, [action.payload]);
        case 'UPDATE_PRODUCT':
            return state.map(function (product) {
                return product.id === action.payload.id ? __assign(__assign({}, product), action.payload.data) : product;
            });
        case 'DELETE_PRODUCT':
            return state.filter(function (product) { return product.id !== action.payload; });
        default:
            return state;
    }
};
exports.ProductProvider = function (_a) {
    var children = _a.children;
    var _b = react_1.useReducer(productReducer, []), products = _b[0], dispatch = _b[1];
    // Fetch products from backend
    react_1.useEffect(function () {
        axios_1["default"].get(import.meta.env.VITE_API_URL + "/products")
            .then(function (response) {
            if (Array.isArray(response.data)) {
                dispatch({ type: 'SET_PRODUCTS', payload: response.data });
            }
            else {
                console.error("Invalid product data:", response.data);
                sonner_1.toast.error("Failed to load products");
            }
        })["catch"](function () {
            sonner_1.toast.error("Failed to load products");
        });
    }, []);
    // Add product
    var addProduct = function (product) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].post('/api/products', product)];
                case 1:
                    response = _a.sent();
                    dispatch({ type: 'ADD_PRODUCT', payload: response.data });
                    sonner_1.toast.success('Product added successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    sonner_1.toast.error('Failed to add product');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Update product
    var updateProduct = function (id, updatedProduct) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].put("/api/products/" + id, updatedProduct)];
                case 1:
                    _a.sent();
                    dispatch({ type: 'UPDATE_PRODUCT', payload: { id: id, data: updatedProduct } });
                    sonner_1.toast.success('Product updated successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    sonner_1.toast.error('Failed to update product');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Delete product
    var deleteProduct = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"]["delete"]("/api/products/" + id)];
                case 1:
                    _a.sent();
                    dispatch({ type: 'DELETE_PRODUCT', payload: id });
                    sonner_1.toast.success('Product deleted successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    sonner_1.toast.error('Failed to delete product');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Get a single product
    var getProduct = function (id) {
        return products.find(function (product) { return product.id === id; });
    };
    return (react_1["default"].createElement(ProductContext.Provider, { value: { products: products, addProduct: addProduct, updateProduct: updateProduct, deleteProduct: deleteProduct, getProduct: getProduct } }, children));
};
