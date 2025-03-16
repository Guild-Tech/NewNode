
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts, Product, CPU, RAM, Storage } from "../../context/ProductContext";
import { Button } from "../../components/ui/button";
import { ProductInfoCard } from "./form/ProductInfoCard";
import { ImageUploader } from "./form/ImageUploader";
import { CpuOptionsCard } from "./form/CpuOptionsCard";
import { RamOptionsCard } from "./form/RamOptionsCard";
import { StorageOptionsCard } from "./form/StorageOptionsCard";
import { validateProductForm, ProductFormData } from "./form/FormValidator";

type ProductFormProps = {
  editMode?: boolean;
  productId?: string;
};

export function ProductForm({ editMode = false, productId }: ProductFormProps) {
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProduct } = useProducts();

  const existingProduct = productId ? getProduct(productId) : undefined;

  const [formState, setFormState] = useState<ProductFormData>({
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    basePrice: existingProduct?.basePrice || 0,
    image: existingProduct?.image || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    category: existingProduct?.category || "Laptop",
    cpuOptions: existingProduct?.cpuOptions || [{ id: Date.now().toString(), name: "", price: 0 }],
    ramOptions: existingProduct?.ramOptions || [{ id: Date.now().toString(), size: "", price: 0 }],
    storageOptions: existingProduct?.storageOptions || [{ id: Date.now().toString(), type: "SSD", size: "", price: 0 }],
  });

  // Field change handlers
  const handleFieldChange = (field: keyof ProductFormData, value: any) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };

  // CPU handlers
  const handleAddCpuOption = () => {
    setFormState({
      ...formState,
      cpuOptions: [
        ...formState.cpuOptions,
        { id: Date.now().toString(), name: "", price: 0 },
      ],
    });
  };

  const handleRemoveCpuOption = (id: string) => {
    setFormState({
      ...formState,
      cpuOptions: formState.cpuOptions.filter(option => option.id !== id),
    });
  };

  const handleCpuOptionChange = (id: string, field: keyof CPU, value: string) => {
    setFormState({
      ...formState,
      cpuOptions: formState.cpuOptions.map(option => 
        option.id === id 
          ? { ...option, [field]: field === 'price' ? parseFloat(value) || 0 : value } 
          : option
      ),
    });
  };

  // RAM handlers
  const handleAddRamOption = () => {
    setFormState({
      ...formState,
      ramOptions: [
        ...formState.ramOptions,
        { id: Date.now().toString(), size: "", price: 0 },
      ],
    });
  };

  const handleRemoveRamOption = (id: string) => {
    setFormState({
      ...formState,
      ramOptions: formState.ramOptions.filter(option => option.id !== id),
    });
  };

  const handleRamOptionChange = (id: string, field: keyof RAM, value: string) => {
    setFormState({
      ...formState,
      ramOptions: formState.ramOptions.map(option => 
        option.id === id 
          ? { ...option, [field]: field === 'price' ? parseFloat(value) || 0 : value } 
          : option
      ),
    });
  };

  // Storage handlers
  const handleAddStorageOption = () => {
    setFormState({
      ...formState,
      storageOptions: [
        ...formState.storageOptions,
        { id: Date.now().toString(), type: "SSD", size: "", price: 0 },
      ],
    });
  };

  const handleRemoveStorageOption = (id: string) => {
    setFormState({
      ...formState,
      storageOptions: formState.storageOptions.filter(option => option.id !== id),
    });
  };

  const handleStorageOptionChange = (id: string, field: keyof Storage, value: string) => {
    setFormState({
      ...formState,
      storageOptions: formState.storageOptions.map(option => 
        option.id === id 
          ? { ...option, [field]: field === 'price' ? parseFloat(value) || 0 : value } 
          : option
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProductForm(formState)) {
      return;
    }
    
    if (editMode && productId) {
      updateProduct(productId, formState);
    } else {
      addProduct(formState);
    }
    
    navigate("/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductInfoCard 
          name={formState.name}
          description={formState.description}
          basePrice={formState.basePrice}
          category={formState.category}
          onNameChange={(value) => handleFieldChange('name', value)}
          onDescriptionChange={(value) => handleFieldChange('description', value)}
          onBasePriceChange={(value) => handleFieldChange('basePrice', value)}
          onCategoryChange={(value) => handleFieldChange('category', value)}
        />

        <ImageUploader 
          image={formState.image}
          onImageChange={(image) => handleFieldChange('image', image)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CpuOptionsCard 
          cpuOptions={formState.cpuOptions}
          onAddOption={handleAddCpuOption}
          onRemoveOption={handleRemoveCpuOption}
          onOptionChange={handleCpuOptionChange}
        />

        <RamOptionsCard 
          ramOptions={formState.ramOptions}
          onAddOption={handleAddRamOption}
          onRemoveOption={handleRemoveRamOption}
          onOptionChange={handleRamOptionChange}
        />

        <StorageOptionsCard 
          storageOptions={formState.storageOptions}
          onAddOption={handleAddStorageOption}
          onRemoveOption={handleRemoveStorageOption}
          onOptionChange={handleStorageOptionChange}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/products')}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editMode ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
