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