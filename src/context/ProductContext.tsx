import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export type CPU = {
  id: number;
  name: string;
  price: number;
};

export type RAM = {
  id: number;
  size: string;
  price: number;
};

export type Storage = {
  id: number;
  type: string;
  size: string;
  price: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  specs: {
    software: ['Dappnode', 'Stereum', 'Sege', 'Coincashew', 'Blockops'];
    ram: ['16GB', '32GB', '64GB'];
    storage: ['2TB SSD', '4TB SSD'];
    processor: ['Intel i3', 'Intel i5', 'Intel i7'];
  };
  createdAt: Date;
}; 

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => Product | undefined;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Reducer to manage product state
const productReducer = (state: Product[], action: any): Product[] => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return action.payload;
    case 'ADD_PRODUCT':
      return [...state, action.payload];
    case 'UPDATE_PRODUCT':
      return state.map((product) =>
        product.id === action.payload.id ? { ...product, ...action.payload.data } : product
      );
    case 'DELETE_PRODUCT':
      return state.filter((product) => product.id !== action.payload);
    default:
      return state;
  }
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, dispatch] = useReducer(productReducer, []);

  // Fetch products from backend
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        } else {
          console.error("Invalid product data:", response.data);
          toast.error("Failed to load products");
        }
      })
      .catch(() => {
        toast.error("Failed to load products");
      });
  }, []);

  // Add product
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, product);
      dispatch({ type: 'ADD_PRODUCT', payload: response.data });
      toast.success('Product added successfully');
    } catch (error) {
      console.error("Update Failed:", error.response?.data || error.message)
      toast.error('Failed to add product');
    }
  };

  // Update product
  const updateProduct = async (id: number, updatedProduct: Partial<Product>) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, updatedProduct);
      console.log("Submitting product update:", JSON.stringify(updatedProduct, null, 2));
      dispatch({ type: 'UPDATE_PRODUCT', payload: { id, data: updatedProduct } });
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  // Delete product
  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Get a single product
  const getProduct = (id: number) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
