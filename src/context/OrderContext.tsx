
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from './ProductContext';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItem = {
  productId: string;
  quantity: number;
  selectedCpu?: string;
  selectedRam?: string;
  selectedStorage?: string;
  price: number;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

// Sample data for initial orders
const initialOrders: Order[] = [
  {
    id: '1',
    customerId: 'cust1',
    customerName: 'Jane Doe',
    customerEmail: 'jane.doe@example.com',
    items: [
      {
        productId: '1',
        quantity: 1,
        selectedCpu: 'cpu2',
        selectedRam: 'ram2',
        selectedStorage: 'storage2',
        price: 1399, // Base + upgrades
      }
    ],
    totalAmount: 1399,
    status: 'pending',
    shippingAddress: '123 Main St, Anytown, CA 12345',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    customerId: 'cust2',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    items: [
      {
        productId: '2',
        quantity: 1,
        selectedCpu: 'cpu3',
        selectedRam: 'ram3',
        selectedStorage: 'storage3',
        price: 2349, // Base + upgrades
      }
    ],
    totalAmount: 2349,
    status: 'processing',
    shippingAddress: '456 Oak Ave, Somewhere, NY 67890',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '3',
    customerId: 'cust3',
    customerName: 'Alice Johnson',
    customerEmail: 'alice.johnson@example.com',
    items: [
      {
        productId: '1',
        quantity: 2,
        selectedCpu: 'cpu1',
        selectedRam: 'ram3',
        selectedStorage: 'storage2',
        price: 2698, // (Base + upgrades) * 2
      }
    ],
    totalAmount: 2698,
    status: 'shipped',
    shippingAddress: '789 Pine Blvd, Elsewhere, TX 54321',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  }
];

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setOrders([...orders, newOrder]);
    toast.success('Order added successfully');
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, ...updates, updatedAt: new Date() }
          : order
      )
    );
    toast.success('Order updated successfully');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
    toast.success(`Order status updated to ${status}`);
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
    toast.success('Order deleted successfully');
  };

  const getOrder = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrder, updateOrderStatus, deleteOrder, getOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};
