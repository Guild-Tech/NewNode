import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { OrderStatus, useOrders } from "../../context/OrderContext";

type OrderStatusSelectProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const { updateOrderStatus, orders, setOrders } = useOrders(); // Ensure state updates
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]); // Update if status changes from backend

  const handleStatusChange = (value: string) => {
    const newStatus = value as OrderStatus;
    setSelectedStatus(newStatus);
    updateOrderStatus(orderId, newStatus);

    // Manually update state to trigger UI change
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  return (
    <Select value={selectedStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status">{selectedStatus}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="processing">Processing</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
