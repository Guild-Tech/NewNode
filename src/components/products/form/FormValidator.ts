
import { toast } from "sonner";
import { CPU, RAM } from "../../../context/ProductContext";
// import { CPU, RAM, Storage } from "@/context/ProductContext";

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  cpuOptions: CPU[];
  ramOptions: RAM[];
  storageOptions: Storage[];
};

export function validateProductForm(formData: ProductFormData): boolean {
  if (!formData.name.trim()) {
    toast.error("Product name is required");
    return false;
  }
  
  if (!formData.description.trim()) {
    toast.error("Product description is required");
    return false;
  }
  
  if (formData.price <= 0) {
    toast.error("Base price must be greater than zero");
    return false;
  }
  
  for (const option of formData.cpuOptions) {
    if (!option.name.trim()) {
      toast.error("All CPU options must have a name");
      return false;
    }
  }
  
  for (const option of formData.ramOptions) {
    if (!option.size.trim()) {
      toast.error("All RAM options must have a size");
      return false;
    }
  }
  
  for (const option of formData.storageOptions) {
    if (!option.size.trim()) {
      toast.error("All Storage options must have a size");
      return false;
    }
  }
  
  return true;
}
