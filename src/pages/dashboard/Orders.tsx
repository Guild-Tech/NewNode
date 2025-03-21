import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useOrders } from "../../context/OrderContext";
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge";
import { OrderStatusSelect } from "../../components/orders/OrderStatusSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Sidebar } from "../../components/layout/Sidebar";

export default function Orders() {
  const { orders } = useOrders();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Orders</h1>

          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                Manage customer orders and their statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.orderID}>
                      <TableCell className="font-medium">
                        #{order.orderID}
                      </TableCell>
                      <TableCell>
                        <div>
                          {order.shippingInfo?.firstName
                            ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.shippingInfo?.email || "No Email"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.createdAt
                          ? format(new Date(order.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.orderStatus} />
                      </TableCell>
                      <TableCell>
                        <OrderStatusSelect
                          orderId={order._id}
                          currentStatus={order.orderStatus}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
