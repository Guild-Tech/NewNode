import { PROCESSOR_OPTIONS, RAM_OPTIONS, STORAGE_OPTIONS } from "../config/constants";

export interface NodeConfig {
  software: 'Dappnode' | 'Stereum' | 'Sege' | 'Coincashew' | 'Blockops';
  ram: '16GB' | '32GB' | '64GB';
  storage: '2TB SSD' | '4TB SSD';
  processor: 'Intel i3' | 'Intel i5' | 'Intel i7';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  specs: {
    software: string;
    ram: string;
    storage: string;
    processor: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
  config: NodeConfig;
  totalPrice: number;
}

export interface PaymentConfig {
  currency: string;
  amount: number;
  receiver: string;
}

declare global {
  interface Window {
    cloudinary: any; // or the actual type of the cloudinary object
  }
}

export type RAMOptionKey = keyof typeof RAM_OPTIONS;
export type STORAGEOptionKey = keyof typeof STORAGE_OPTIONS;
export type PROCESSOROptionKey = keyof typeof PROCESSOR_OPTIONS;

