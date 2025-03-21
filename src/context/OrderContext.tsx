import  { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

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
  _id: string;
  orderID: string;
  order_description?: string;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalPrice: number;
  orderStatus: OrderStatus;
  warranty?: string;
  shippingPolicy?: string;
  customerSupport?: string;
  stripe_session_id?: string;
  createdAt: string;
  updatedAt: string;
};

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
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

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  // Add a new order
  const addOrder = async (order: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/order`, order);
      setOrders((prevOrders) => [...prevOrders, response.data.order]);
      toast.success('Order added successfully');
    } catch (error) {
      toast.error('Failed to add order');
    }
  };

  // Update an order
  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}`, updates);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === id ? response.data.order : order))
      );
      toast.success('Order updated successfully');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { orderStatus: status }); 
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === id ? response.data.order : order))
      );
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Delete an order
  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  // Get a single order
  const getOrder = (id: string) => {
    return orders.find((order) => order._id === id);
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrder, updateOrderStatus, deleteOrder, getOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};
