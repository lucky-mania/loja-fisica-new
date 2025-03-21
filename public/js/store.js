/**
 * Gerenciamento de dados da loja
 */

// Dados padrão de produtos
const defaultProducts = [
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

// Configurações padrão
const defaultSettings = {
  whatsappNumber: '5511987654321',
  welcomeMessage: 'Olá! Seja bem-vindo à nossa loja!',
  adminPassword: 'draxx'
};

/**
 * Inicializa a loja
 */
function initializeStore() {
  // Verificar se produtos existem no localStorage, se não, adicionar produtos padrão
  if (!loadFromLocalStorage('products')) {
    saveToLocalStorage('products', defaultProducts);
    
    // Adicionar entradas de histórico para produtos iniciais
    const initialHistory = defaultProducts.map(product => ({
      timestamp: new Date().toISOString(),
      action: 'added',
      itemName: product.name,
      details: 'Produto inicial do sistema'
    }));
    
    saveToLocalStorage('history', initialHistory);
  }
  
  // Inicializar carrinho se não existir
  if (!loadFromLocalStorage('cart')) {
    saveToLocalStorage('cart', []);
  }
  
  // Inicializar cupons se não existirem
  if (!loadFromLocalStorage('coupons')) {
    saveToLocalStorage('coupons', []);
  }
  
  // Inicializar configurações se não existirem
  if (!loadFromLocalStorage('settings')) {
    saveToLocalStorage('settings', defaultSettings);
  }
  
  // Inicializar histórico se não existir
  if (!loadFromLocalStorage('history')) {
    saveToLocalStorage('history', []);
  }
}

/**
 * Funções de gerenciamento de produtos
 */
function getProducts() {
  return loadFromLocalStorage('products') || [];
}

function addProduct(productData) {
  const products = getProducts();
  
  const newProduct = {
    ...productData,
    id: generateId()
  };
  
  products.push(newProduct);
  saveToLocalStorage('products', products);
  
  // Adicionar ao histórico
  addToHistory('added', newProduct.name, 'Produto adicionado ao catálogo');
  
  dispatchCustomEvent('productsUpdated');
  
  return newProduct;
}

function updateProduct(product) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  if (index !== -1) {
    const oldProduct = products[index];
    products[index] = product;
    saveToLocalStorage('products', products);
    
    // Adicionar ao histórico
    addToHistory(
      'modified', 
      product.name, 
      `Produto atualizado (Preço: R$ ${formatCurrency(oldProduct.price)} → R$ ${formatCurrency(product.price)})`
    );
    
    dispatchCustomEvent('productsUpdated');
  }
}

function removeProduct(productId) {
  const products = getProducts();
  const productToRemove = products.find(p => p.id === productId);
  
  if (productToRemove) {
    const updatedProducts = products.filter(p => p.id !== productId);
    saveToLocalStorage('products', updatedProducts);
    
    // Adicionar ao histórico
    addToHistory('removed', productToRemove.name, 'Produto removido do catálogo');
    
    dispatchCustomEvent('productsUpdated');
  }
}

/**
 * Funções de gerenciamento do carrinho
 */
function getCart() {
  return loadFromLocalStorage('cart') || [];
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function addToCart(product) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
    // Produto já está no carrinho, aumentar quantidade
    cart[existingItemIndex].quantity += 1;
  } else {
    // Adicionar novo produto ao carrinho
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  saveToLocalStorage('cart', cart);
  dispatchCustomEvent('cartUpdated');
}

function updateCartItemQuantity(itemId, change) {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    const newQuantity = cart[itemIndex].quantity + change;
    
    if (newQuantity <= 0) {
      // Remover item se a quantidade se tornar 0 ou menos
      cart.splice(itemIndex, 1);
    } else {
      // Atualizar quantidade
      cart[itemIndex].quantity = newQuantity;
    }
    
    saveToLocalStorage('cart', cart);
    dispatchCustomEvent('cartUpdated');
  }
}

function removeFromCart(itemId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  
  saveToLocalStorage('cart', updatedCart);
  dispatchCustomEvent('cartUpdated');
}

function clearCart() {
  saveToLocalStorage('cart', []);
  
  // Remover cupom aplicado
  removeFromLocalStorage('appliedCoupon');
  
  dispatchCustomEvent('cartUpdated');
}

/**
 * Funções de gerenciamento de cupons
 */
function getCoupons() {
  return loadFromLocalStorage('coupons') || [];
}

function addCoupon(couponData) {
  const coupons = getCoupons();
  
  // Verificar se já existe cupom com o mesmo código
  const existingCoupon = coupons.find(c => c.code === couponData.code);
  if (existingCoupon) {
    throw new Error('Cupom com este código já existe');
  }
  
  coupons.push(couponData);
  saveToLocalStorage('coupons', coupons);
  
  // Adicionar ao histórico
  addToHistory('added', couponData.code, `Cupom de ${couponData.discount}% de desconto criado`);
  
  dispatchCustomEvent('couponsUpdated');
}

function removeCoupon(couponCode) {
  const coupons = getCoupons();
  const couponToRemove = coupons.find(c => c.code === couponCode);
  
  if (couponToRemove) {
    const updatedCoupons = coupons.filter(c => c.code !== couponCode);
    saveToLocalStorage('coupons', updatedCoupons);
    
    // Adicionar ao histórico
    addToHistory('removed', couponCode, 'Cupom desativado');
    
    dispatchCustomEvent('couponsUpdated');
  }
}

function applyCoupon(couponCode) {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code === couponCode);
  
  if (!coupon) {
    return { success: false, message: 'Cupom não encontrado' };
  }
  
  // Verificar se o cupom expirou
  if (new Date(coupon.expiryDate) < new Date()) {
    return { success: false, message: 'Cupom expirado' };
  }
  
  // Verificar se o limite de uso do cupom foi atingido
  if (coupon.usageCount >= coupon.usageLimit) {
    return { success: false, message: 'Limite de uso do cupom atingido' };
  }
  
  // Aplicar cupom
  coupon.usageCount += 1;
  
  // Atualizar cupom no armazenamento
  const updatedCoupons = coupons.map(c => c.code === couponCode ? coupon : c);
  saveToLocalStorage('coupons', updatedCoupons);
  
  // Salvar cupom aplicado
  saveToLocalStorage('appliedCoupon', coupon);
  
  dispatchCustomEvent('couponsUpdated');
  dispatchCustomEvent('cartUpdated');
  
  return { success: true, message: 'Cupom aplicado com sucesso' };
}

function getAppliedCoupon() {
  return loadFromLocalStorage('appliedCoupon') || null;
}

/**
 * Funções de gerenciamento de configurações
 */
function getSettings() {
  return loadFromLocalStorage('settings') || defaultSettings;
}

function updateSettings(settings) {
  // Se o campo de senha estiver vazio, manter a senha existente
  if (!settings.adminPassword) {
    const currentSettings = getSettings();
    settings.adminPassword = currentSettings.adminPassword;
  }
  
  saveToLocalStorage('settings', settings);
  
  // Adicionar ao histórico
  addToHistory('modified', 'Configurações', 'Configurações da loja atualizadas');
  
  dispatchCustomEvent('settingsUpdated');
}

function verifyAdminPassword(password) {
  const settings = getSettings();
  return password === settings.adminPassword;
}

/**
 * Funções de gerenciamento de histórico
 */
function getHistory() {
  return loadFromLocalStorage('history') || [];
}

function addToHistory(action, itemName, details) {
  const history = getHistory();
  
  const historyItem = {
    timestamp: new Date().toISOString(),
    action,
    itemName,
    details
  };
  
  // Adicionar novo item no início do array
  history.unshift(historyItem);
  
  // Manter apenas as últimas 100 entradas
  const limitedHistory = history.slice(0, 100);
  
  saveToLocalStorage('history', limitedHistory);
  dispatchCustomEvent('historyUpdated');
}