
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Trash2, Plus, MemoryStick } from "lucide-react";
import { RAM } from "../../../context/ProductContext";

type RamOptionsCardProps = {
  ramOptions: RAM[];
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onOptionChange: (id: string, field: keyof RAM, value: string) => void;
};

export function RamOptionsCard({ 
  ramOptions, 
  onAddOption, 
  onRemoveOption, 
  onOptionChange 
}: RamOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg flex items-center">
            <MemoryStick className="h-5 w-5 mr-2 text-green-500" />
            RAM Options
          </CardTitle>
          <CardDescription>Configure available RAM options</CardDescription>
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
      <CardContent className="space-y-4 pt-3 bg-white">
        {ramOptions.map((option) => (
          <div key={option.id} className="grid grid-cols-[1fr,auto] gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="RAM Size"
                value={option.size}
                onChange={(e) => onOptionChange(option.id as any, 'size', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={option.price}
                min="0"
                onChange={(e) => onOptionChange(option.id as any, 'price', e.target.value)}
              />
            </div>
            {ramOptions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveOption(option.id as any)}
                className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {ramOptions.length === 0 && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No RAM options added
          </div>
        )}
      </CardContent>
    </Card>
  );
}
