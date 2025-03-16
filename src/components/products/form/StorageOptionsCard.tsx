
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Trash2, Plus, HardDrive } from "lucide-react";
import { Storage } from "../../../context/ProductContext";

type StorageOptionsCardProps = {
  storageOptions: Storage[];
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onOptionChange: (id: string, field: keyof Storage, value: string) => void;
};

export function StorageOptionsCard({ 
  storageOptions, 
  onAddOption, 
  onRemoveOption, 
  onOptionChange 
}: StorageOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-purple-500" />
            Storage Options
          </CardTitle>
          <CardDescription>Configure available storage options</CardDescription>
        </div>
        <Button 
          type="button" 
          onClick={onAddOption} 
          size="sm" 
          variant="outline"
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        {storageOptions.map((option) => (
          <div key={option.id} className="grid grid-cols-[1fr,auto] gap-2">
            <div className="grid grid-cols-3 gap-2">
              <Select 
                value={option.type} 
                onValueChange={(value) => onOptionChange(option.id, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SSD">SSD</SelectItem>
                  <SelectItem value="HDD">HDD</SelectItem>
                  <SelectItem value="NVMe">NVMe</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Size"
                value={option.size}
                onChange={(e) => onOptionChange(option.id, 'size', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={option.price}
                min="0"
                onChange={(e) => onOptionChange(option.id, 'price', e.target.value)}
              />
            </div>
            {storageOptions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveOption(option.id)}
                className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {storageOptions.length === 0 && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No storage options added
          </div>
        )}
      </CardContent>
    </Card>
  );
}
