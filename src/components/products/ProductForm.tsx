import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useProducts,
  Product,
  CPU,
  RAM,
  Storage,
} from "../../context/ProductContext";
import {
  PROCESSOR_OPTIONS,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
} from "../../config/constants";
import { Button } from "../../components/ui/button";
import { ProductInfoCard } from "./form/ProductInfoCard";
import { ImageUploader } from "./form/ImageUploader";
import { CpuOptionsCard } from "./form/CpuOptionsCard";
import { RamOptionsCard } from "./form/RamOptionsCard";
import { StorageOptionsCard } from "./form/StorageOptionsCard";
import { validateProductForm, ProductFormData } from "./form/FormValidator";

type ProductFormProps = {
  editMode?: boolean;
  productId?: number;
};

export function ProductForm({ editMode = false, productId }: ProductFormProps) {
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProduct } = useProducts();

  const existingProduct = productId ? getProduct(productId) : undefined;
  console.log("Product ID:", productId);

  const [formState, setFormState] = useState<ProductFormData>({
    name: existingProduct?.name || "",
    description: existingProduct?.details || "",
    price: existingProduct?.price || 0,
    image:
      existingProduct?.image ||
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    category: existingProduct?.category || "Laptop",
    software: existingProduct?.specs?.software || "Dappnode", // Include software
    cpuOptions: existingProduct?.specs?.processor
      ? Object.keys(PROCESSOR_OPTIONS).map((key) => ({
          id: key,
          name: PROCESSOR_OPTIONS[key].label,
          price: PROCESSOR_OPTIONS[key].price,
        }))
      : [],
    ramOptions: existingProduct?.specs?.ram
      ? Object.keys(RAM_OPTIONS).map((key) => ({
          id: key,
          size: RAM_OPTIONS[key].label,
          price: RAM_OPTIONS[key].price,
        }))
      : [],
    storageOptions: existingProduct?.specs?.storage
      ? Object.keys(STORAGE_OPTIONS).map((key) => ({
          id: key,
          type: "SSD",
          size: STORAGE_OPTIONS[key].label,
          price: STORAGE_OPTIONS[key].price,
        }))
      : [],
  }); 

  // Field change handlers
  const handleFieldChange = (field: keyof ProductFormData, value: any) => {
    setFormState({
      ...formState,
      [field]: field === "price" ? (value === "" ? "" : parseInt(value)) : value,
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
      cpuOptions: formState.cpuOptions.filter((option) => option.id !== id),
    });
  };

  const handleCpuOptionChange = (
    id: string,
    field: keyof CPU,
    value: string
  ) => {
    setFormState({
      ...formState,
      cpuOptions: formState.cpuOptions.map((option) =>
        option.id === id
          ? {
              ...option,
              [field]: field === "price" ? parseFloat(value) || 0 : value,
            }
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
      ramOptions: formState.ramOptions.filter((option) => option.id !== id),
    });
  };

  const handleRamOptionChange = (
    id: string,
    field: keyof RAM,
    value: string
  ) => {
    setFormState({
      ...formState,
      ramOptions: formState.ramOptions.map((option) =>
        option.id === id
          ? {
              ...option,
              [field]: field === "price" ? parseFloat(value) || 0 : value,
            }
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
      storageOptions: formState.storageOptions.filter(
        (option) => option.id !== id
      ),
    });
  };

  const handleStorageOptionChange = (
    id: string,
    field: keyof Storage,
    value: string
  ) => {
    setFormState({
      ...formState,
      storageOptions: formState.storageOptions.map((option) =>
        option.id === id
          ? {
              ...option,
              [field]: field === "price" ? parseFloat(value) || 0 : value,
            }
          : option
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateProductForm(formState)) {
      return;
    }
  
    const productData = {
      name: formState.name,
      description: formState.description,
      price: formState.price,
      image: formState.image,
      specs: {
        software: formState.software,
        processor:
          formState.cpuOptions.length > 0 ? formState.cpuOptions[0].name : "Intel i3",
        ram: formState.ramOptions.length > 0 ? formState.ramOptions[0].size : "16GB",
        storage: formState.storageOptions.length > 0 ? formState.storageOptions[0].size : "2TB SSD",
      },
    };
  
    if (editMode && productId) {
      updateProduct(productId, productData);
    } else {
      addProduct(productData);
    }
  
    navigate("/dashboard-home");
    console.log("Submitting product update:", productData);
  };  

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductInfoCard
          name={formState.name}
          description={formState.description}
          price={formState.price}
          category={formState.category}
          onNameChange={(value) => handleFieldChange("name", value)}
          onDescriptionChange={(value) =>
            handleFieldChange("description", value)
          }
          onpriceChange={(value) => handleFieldChange("price", value)}
          onCategoryChange={(value) => handleFieldChange("category", value)}
        />

        <ImageUploader
          image={formState.image}
          onImageChange={(image) => handleFieldChange("image", image)}
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
          onClick={() => navigate("/products")}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editMode ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
