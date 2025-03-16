
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { OrderStatus, useOrders } from '../../context/OrderContext';

type OrderStatusSelectProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const { updateOrderStatus } = useOrders();
  
  const handleStatusChange = (value: string) => {
    updateOrderStatus(orderId, value as OrderStatus);
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
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
