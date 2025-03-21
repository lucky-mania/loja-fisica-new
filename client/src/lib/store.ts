import { v4 as uuidv4 } from 'uuid';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  removeFromLocalStorage 
} from './localStorage';

import { 
  Product, 
  CartItem, 
  Coupon, 
  StoreSettings, 
  HistoryItem 
} from './types';

// Initialize default data for the store
const defaultProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Camiseta Premium',
    price: 89.90,
    category: 'Camisetas',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Camiseta de alta qualidade com tecido 100% algodão'
  },
  {
    id: 'product-2',
    name: 'Calça Jeans Confort',
    price: 159.90,
    category: 'Calças',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Calça jeans com elastano para maior conforto'
  },
  {
    id: 'product-3',
    name: 'Vestido Elegante',
    price: 199.90,
    category: 'Vestidos',
    imageUrl: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Vestido elegante para ocasiões especiais'
  },
  {
    id: 'product-4',
    name: 'Bolsa Moderna',
    price: 129.90,
    category: 'Acessórios',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Bolsa espaçosa e moderna para o dia a dia'
  }
];

const defaultSettings: StoreSettings = {
  whatsappNumber: '5511987654321',
  welcomeMessage: 'Olá! Seja bem-vindo à nossa loja!',
  adminPassword: 'draxx'
};

// Event dispatchers
const dispatchProductsUpdated = () => {
  window.dispatchEvent(new Event('productsUpdated'));
};

const dispatchCartUpdated = () => {
  window.dispatchEvent(new Event('cartUpdated'));
};

const dispatchCouponsUpdated = () => {
  window.dispatchEvent(new Event('couponsUpdated'));
};

const dispatchHistoryUpdated = () => {
  window.dispatchEvent(new Event('historyUpdated'));
};

const dispatchSettingsUpdated = () => {
  window.dispatchEvent(new Event('settingsUpdated'));
};

// Initialize the store
export const initializeStore = () => {
  // Check if products exist in localStorage, if not, add default products
  if (!loadFromLocalStorage('products')) {
    saveToLocalStorage('products', defaultProducts);
    
    // Add history entries for initial products
    const initialHistory: HistoryItem[] = defaultProducts.map(product => ({
      timestamp: new Date().toISOString(),
      action: 'added',
      itemName: product.name,
      details: 'Produto inicial do sistema'
    }));
    
    saveToLocalStorage('history', initialHistory);
  }
  
  // Initialize cart if it doesn't exist
  if (!loadFromLocalStorage('cart')) {
    saveToLocalStorage('cart', []);
  }
  
  // Initialize coupons if they don't exist
  if (!loadFromLocalStorage('coupons')) {
    saveToLocalStorage('coupons', []);
  }
  
  // Initialize settings if they don't exist
  if (!loadFromLocalStorage('settings')) {
    saveToLocalStorage('settings', defaultSettings);
  }
  
  // Initialize history if it doesn't exist
  if (!loadFromLocalStorage('history')) {
    saveToLocalStorage('history', []);
  }
};

// Product Management
export const getProducts = (): Product[] => {
  return loadFromLocalStorage('products') || [];
};

export const addProduct = (productData: Omit<Product, 'id'>): Product => {
  const products = getProducts();
  
  const newProduct: Product = {
    ...productData,
    id: `product-${uuidv4()}`
  };
  
  products.push(newProduct);
  saveToLocalStorage('products', products);
  
  // Add to history
  addToHistory('added', newProduct.name, 'Produto adicionado ao catálogo');
  
  dispatchProductsUpdated();
  
  return newProduct;
};

export const updateProduct = (product: Product): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  if (index !== -1) {
    const oldProduct = products[index];
    products[index] = product;
    saveToLocalStorage('products', products);
    
    // Add to history
    addToHistory(
      'modified', 
      product.name, 
      `Produto atualizado (Preço: R$ ${oldProduct.price.toFixed(2)} → R$ ${product.price.toFixed(2)})`
    );
    
    dispatchProductsUpdated();
  }
};

export const removeProduct = (productId: string): void => {
  const products = getProducts();
  const productToRemove = products.find(p => p.id === productId);
  
  if (productToRemove) {
    const updatedProducts = products.filter(p => p.id !== productId);
    saveToLocalStorage('products', updatedProducts);
    
    // Add to history
    addToHistory('removed', productToRemove.name, 'Produto removido do catálogo');
    
    dispatchProductsUpdated();
  }
};

// Cart Management
export const getCart = (): CartItem[] => {
  return loadFromLocalStorage('cart') || [];
};

export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const addToCart = (product: Product): void => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
    // Product already in cart, increase quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new product to cart
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  saveToLocalStorage('cart', cart);
  dispatchCartUpdated();
};

export const updateCartItemQuantity = (itemId: string, change: number): void => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    const newQuantity = cart[itemIndex].quantity + change;
    
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0 or less
      cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart[itemIndex].quantity = newQuantity;
    }
    
    saveToLocalStorage('cart', cart);
    dispatchCartUpdated();
  }
};

export const removeFromCart = (itemId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  
  saveToLocalStorage('cart', updatedCart);
  dispatchCartUpdated();
};

export const clearCart = (): void => {
  saveToLocalStorage('cart', []);
  
  // Remove applied coupon
  removeFromLocalStorage('appliedCoupon');
  
  dispatchCartUpdated();
};

// Coupon Management
export const getCoupons = (): Coupon[] => {
  return loadFromLocalStorage('coupons') || [];
};

export const addCoupon = (couponData: Coupon): void => {
  const coupons = getCoupons();
  
  // Check if coupon with the same code already exists
  const existingCoupon = coupons.find(c => c.code === couponData.code);
  if (existingCoupon) {
    throw new Error('Cupom com este código já existe');
  }
  
  coupons.push(couponData);
  saveToLocalStorage('coupons', coupons);
  
  // Add to history
  addToHistory('added', couponData.code, `Cupom de ${couponData.discount}% de desconto criado`);
  
  dispatchCouponsUpdated();
};

export const removeCoupon = (couponCode: string): void => {
  const coupons = getCoupons();
  const couponToRemove = coupons.find(c => c.code === couponCode);
  
  if (couponToRemove) {
    const updatedCoupons = coupons.filter(c => c.code !== couponCode);
    saveToLocalStorage('coupons', updatedCoupons);
    
    // Add to history
    addToHistory('removed', couponCode, 'Cupom desativado');
    
    dispatchCouponsUpdated();
  }
};

export const applyCoupon = (couponCode: string): { success: boolean; message: string } => {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code === couponCode);
  
  if (!coupon) {
    return { success: false, message: 'Cupom não encontrado' };
  }
  
  // Check if coupon has expired
  if (new Date(coupon.expiryDate) < new Date()) {
    return { success: false, message: 'Cupom expirado' };
  }
  
  // Check if coupon usage limit has been reached
  if (coupon.usageCount >= coupon.usageLimit) {
    return { success: false, message: 'Limite de uso do cupom atingido' };
  }
  
  // Apply coupon
  coupon.usageCount += 1;
  
  // Update coupon in storage
  const updatedCoupons = coupons.map(c => c.code === couponCode ? coupon : c);
  saveToLocalStorage('coupons', updatedCoupons);
  
  // Save applied coupon
  saveToLocalStorage('appliedCoupon', coupon);
  
  dispatchCouponsUpdated();
  dispatchCartUpdated();
  
  return { success: true, message: 'Cupom aplicado com sucesso' };
};

export const getAppliedCoupon = (): Coupon | null => {
  return loadFromLocalStorage('appliedCoupon') || null;
};

// Settings Management
export const getSettings = (): StoreSettings => {
  return loadFromLocalStorage('settings') || defaultSettings;
};

export const updateSettings = (settings: StoreSettings): void => {
  // If password field is empty, keep the existing password
  if (!settings.adminPassword) {
    const currentSettings = getSettings();
    settings.adminPassword = currentSettings.adminPassword;
  }
  
  saveToLocalStorage('settings', settings);
  
  // Add to history
  addToHistory('modified', 'Configurações', 'Configurações da loja atualizadas');
  
  dispatchSettingsUpdated();
};

export const verifyAdminPassword = (password: string): boolean => {
  const settings = getSettings();
  return password === settings.adminPassword;
};

// History Management
export const getHistory = (): HistoryItem[] => {
  return loadFromLocalStorage('history') || [];
};

export const addToHistory = (action: 'added' | 'modified' | 'removed', itemName: string, details: string): void => {
  const history = getHistory();
  
  const historyItem: HistoryItem = {
    timestamp: new Date().toISOString(),
    action,
    itemName,
    details
  };
  
  // Add new item at the beginning of the array
  history.unshift(historyItem);
  
  // Keep only the latest 100 entries
  const limitedHistory = history.slice(0, 100);
  
  saveToLocalStorage('history', limitedHistory);
  dispatchHistoryUpdated();
};
