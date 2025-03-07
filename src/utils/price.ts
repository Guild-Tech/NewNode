import { RAM_OPTIONS, STORAGE_OPTIONS, PROCESSOR_OPTIONS } from '../config/constants';

export function calculatePrice(basePrice: number, config: { software?: string; ram?: string; storage?: string; processor?: string }) {
  const { 
    software = "Dappnode", // Ensure a default is set
    ram = "16GB", 
    storage = "2TB SSD", 
    processor = "Intel i3" 
  } = config;

  const ramPrice = RAM_OPTIONS[ram]?.price || 0;
  const storagePrice = STORAGE_OPTIONS[storage]?.price || 0;
  const processorPrice = PROCESSOR_OPTIONS[processor]?.price || 0;

  const totalPrice = basePrice + ramPrice + storagePrice + processorPrice;

  return totalPrice;
}
