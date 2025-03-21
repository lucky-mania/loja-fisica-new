// Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
}

// Cart item extends Product with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Coupon type
export interface Coupon {
  code: string;
  discount: number; // Percentage discount
  expiryDate: string; // ISO date string
  usageLimit: number;
  usageCount: number;
}

// Store settings
export interface StoreSettings {
  whatsappNumber: string;
  welcomeMessage: string;
  adminPassword: string;
}

// History item
export interface HistoryItem {
  timestamp: string; // ISO date string
  action: 'added' | 'modified' | 'removed';
  itemName: string;
  details: string;
}
