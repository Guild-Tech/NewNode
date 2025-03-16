
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

type ImageUploaderProps = {
  image: string;
  onImageChange: (image: string) => void;
};

export function ImageUploader({ image, onImageChange }: ImageUploaderProps) {
  const handleImageUpload = () => {
    const placeholderUrls = [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop"
    ];
    
    const randomUrl = placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)];
    onImageChange(randomUrl);
    toast.success("Image uploaded successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Image</CardTitle>
        <CardDescription>Upload a product image</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {image ? (
          <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-md">
            <img 
              src={image} 
              alt="Product preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onImageChange("")}
              className="absolute top-2 right-2 bg-white/90 p-1 rounded-full hover:bg-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 w-full flex flex-col items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Drag and drop an image, or click to browse
            </p>
          </div>
        )}
        <Button 
          type="button" 
          onClick={handleImageUpload} 
          variant="outline" 
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      </CardContent>
    </Card>
  );
}
