
// import { DashboardLayout } from "@/components/layout/Dashboard";
// import { SectionHeader } from "@/components/ui/SectionHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Gift, Package, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { DashboardLayout } from "../../components/layout/Dashboard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ProductCard } from "../../components/products/ProductCard";
// import { useProducts } from "@/context/ProductContext";
// import { ProductCard } from "@/components/products/ProductCard";

const Dashboard = () => {
  const { products } = useProducts();
  
  const latestProducts = products.slice(0, 3);
  
  const totalProducts = products.length;
  const averagePrice = products.length 
    ? products.reduce((sum, product) => sum + product.basePrice, 0) / products.length 
    : 0;
  const totalOptions = products.reduce(
    (sum, product) => 
      sum + product.cpuOptions.length + product.ramOptions.length + product.storageOptions.length, 
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader 
          title="Dashboard" 
          description="Welcome to your product management dashboard"
          action={
            <Button asChild>
              <Link to="/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          }
        />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <ShoppingBag className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customization Options</CardTitle>
              <Gift className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOptions}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Components</CardTitle>
              <Cpu className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.cpuOptions.length, 0)}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Latest Products</h3>
            <Button variant="outline" asChild size="sm">
              <Link to="/products">View all</Link>
            </Button>
          </div>
          
          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Package className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Button asChild>
                  <Link to="/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
