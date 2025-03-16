
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Trash2, Plus, Cpu } from "lucide-react";
import { CPU } from "../../../context/ProductContext";

type CpuOptionsCardProps = {
  cpuOptions: CPU[];
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onOptionChange: (id: string, field: keyof CPU, value: string) => void;
};

export function CpuOptionsCard({ 
  cpuOptions, 
  onAddOption, 
  onRemoveOption, 
  onOptionChange 
}: CpuOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-blue-500" />
            CPU Options
          </CardTitle>
          <CardDescription>Configure available CPU options</CardDescription>
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
        {cpuOptions.map((option) => (
          <div key={option.id} className="grid grid-cols-[1fr,auto] gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="CPU Name"
                value={option.name}
                onChange={(e) => onOptionChange(option.id, 'name', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={option.price}
                min="0"
                onChange={(e) => onOptionChange(option.id, 'price', e.target.value)}
              />
            </div>
            {cpuOptions.length > 1 && (
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
        {cpuOptions.length === 0 && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No CPU options added
          </div>
        )}
      </CardContent>
    </Card>
  );
}
