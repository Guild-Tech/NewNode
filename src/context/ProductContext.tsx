
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type CPU = {
  id: string;
  name: string;
  price: number;
};

export type RAM = {
  id: string;
  size: string;
  price: number;
};

export type Storage = {
  id: string;
  type: string;
  size: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  cpuOptions: CPU[];
  ramOptions: RAM[];
  storageOptions: Storage[];
  createdAt: Date;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Sample data for initial products
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'ProBook X3',
    description: 'Professional laptop for developers',
    basePrice: 999,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
    category: 'Laptop',
    cpuOptions: [
      { id: 'cpu1', name: 'Intel i5 12th Gen', price: 0 },
      { id: 'cpu2', name: 'Intel i7 12th Gen', price: 200 },
      { id: 'cpu3', name: 'Intel i9 12th Gen', price: 400 },
    ],
    ramOptions: [
      { id: 'ram1', size: '8GB', price: 0 },
      { id: 'ram2', size: '16GB', price: 100 },
      { id: 'ram3', size: '32GB', price: 250 },
    ],
    storageOptions: [
      { id: 'storage1', type: 'SSD', size: '256GB', price: 0 },
      { id: 'storage2', type: 'SSD', size: '512GB', price: 100 },
      { id: 'storage3', type: 'SSD', size: '1TB', price: 200 },
    ],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'UltraDesk Pro',
    description: 'High performance desktop for gaming and content creation',
    basePrice: 1299,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop',
    category: 'Desktop',
    cpuOptions: [
      { id: 'cpu1', name: 'AMD Ryzen 5', price: 0 },
      { id: 'cpu2', name: 'AMD Ryzen 7', price: 200 },
      { id: 'cpu3', name: 'AMD Ryzen 9', price: 450 },
    ],
    ramOptions: [
      { id: 'ram1', size: '16GB', price: 0 },
      { id: 'ram2', size: '32GB', price: 150 },
      { id: 'ram3', size: '64GB', price: 300 },
    ],
    storageOptions: [
      { id: 'storage1', type: 'SSD', size: '512GB', price: 0 },
      { id: 'storage2', type: 'SSD', size: '1TB', price: 120 },
      { id: 'storage3', type: 'SSD', size: '2TB', price: 250 },
    ],
    createdAt: new Date(),
  }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProducts([...products, newProduct]);
    toast.success('Product added successfully');
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
    toast.success('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    toast.success('Product deleted successfully');
  };

  const getProduct = (id: string) => {
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
