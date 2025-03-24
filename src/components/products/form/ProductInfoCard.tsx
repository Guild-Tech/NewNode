
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type ProductInfoCardProps = {
  name: string;
  description: string;
  price: number;
  category: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onpriceChange: (value: number) => void;
  onCategoryChange: (value: string) => void;
};

export function ProductInfoCard({
  name,
  description,
  price,
  category,
  onNameChange,
  onDescriptionChange,
  onpriceChange,
  onCategoryChange,
}: ProductInfoCardProps) {
  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Basic details about your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter product description"
            className="min-h-[120px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Base Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => onpriceChange(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value: any) => onCategoryChange(value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
                <SelectItem value="Accessory">Accessory</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
