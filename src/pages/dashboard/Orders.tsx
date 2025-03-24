import { useState } from "react";
import { format } from "date-fns";
import { Menu, X } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with responsive behavior */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-x-auto">
        {/* Mobile header with toggle button */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b p-4 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="ml-4 text-xl font-semibold">Orders</h1>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 ">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Orders</h1>

            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  Manage customer orders and their statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}