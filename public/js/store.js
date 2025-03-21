/**
 * Inicializa a loja
 */
function initializeStore() {
    // Verifica se já existem produtos no localStorage, caso contrário, cria produtos padrão
    if (!loadFromLocalStorage('products')) {
        const defaultProducts = [
            {
                id: generateId(),
                name: 'Camiseta Básica',
                price: 39.90,
                category: 'camisetas',
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Camiseta básica de algodão com acabamento de primeira linha.',
                sizes: ['P', 'M', 'G', 'GG'],
                availableSizes: ['P', 'M', 'G', 'GG']
            },
            {
                id: generateId(),
                name: 'Calça Jeans',
                price: 89.90,
                category: 'calcas',
                imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Calça jeans confortável com design moderno e durável.',
                sizes: ['38', '40', '42', '44', '46'],
                availableSizes: ['38', '40', '42', '44']
            },
            {
                id: generateId(),
                name: 'Boné Esportivo',
                price: 29.90,
                category: 'acessorios',
                imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Boné esportivo com proteção UV e material respirável.',
                sizes: ['Único'],
                availableSizes: ['Único']
            },
            {
                id: generateId(),
                name: 'Camiseta Estampada',
                price: 49.90,
                category: 'camisetas',
                imageUrl: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Camiseta com estampa exclusiva, 100% algodão.',
                sizes: ['P', 'M', 'G', 'GG'],
                availableSizes: ['P', 'M', 'GG']
            },
            {
                id: generateId(),
                name: 'Calça Moletom',
                price: 79.90,
                category: 'calcas',
                imageUrl: 'https://images.unsplash.com/photo-1606486306004-5bc76f9109e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Calça de moletom confortável, ideal para o dia a dia.',
                sizes: ['P', 'M', 'G', 'GG'],
                availableSizes: ['P', 'G', 'GG']
            },
            {
                id: generateId(),
                name: 'Pulseira de Couro',
                price: 19.90,
                category: 'acessorios',
                imageUrl: 'https://images.unsplash.com/photo-1573053009858-c1ed191d8a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Pulseira de couro artesanal com acabamento premium.',
                sizes: ['Único'],
                availableSizes: ['Único']
            }
        ];
        saveToLocalStorage('products', defaultProducts);
    }

    // Verifica se já existem configurações no localStorage, caso contrário, cria configurações padrão
    if (!loadFromLocalStorage('settings')) {
        const defaultSettings = {
            whatsappNumber: '5511999999999',
            welcomeMessage: 'Olá! Gostaria de fazer um pedido:',
            adminPassword: 'draxx' // Senha padrão para acesso administrativo
        };
        saveToLocalStorage('settings', defaultSettings);
    }

    // Inicializa o carrinho se não existir
    if (!loadFromLocalStorage('cart')) {
        saveToLocalStorage('cart', []);
    }

    // Inicializa os cupons se não existirem
    if (!loadFromLocalStorage('coupons')) {
        saveToLocalStorage('coupons', []);
    }

    // Inicializa o histórico se não existir
    if (!loadFromLocalStorage('history')) {
        saveToLocalStorage('history', []);
    }
    
    // Inicializa novidades se não existirem
    if (!loadFromLocalStorage('news')) {
        saveToLocalStorage('news', []);
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

    // Registra no histórico
    addToHistory('added', productData.name, 'Produto adicionado');
    
    return newProduct;
}

function updateProduct(product) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
        products[index] = product;
        saveToLocalStorage('products', products);
        
        // Registra no histórico
        addToHistory('modified', product.name, 'Produto atualizado');
        return true;
    }
    
    return false;
}

function removeProduct(productId) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        const removedProduct = products[index];
        products.splice(index, 1);
        saveToLocalStorage('products', products);
        
        // Registra no histórico
        addToHistory('removed', removedProduct.name, 'Produto removido');
        return true;
    }
    
    return false;
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
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveToLocalStorage('cart', cart);
    dispatchCustomEvent('cartUpdated');
    
    return cart;
}

function updateCartItemQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            return removeFromCart(itemId);
        }
        
        saveToLocalStorage('cart', cart);
        dispatchCustomEvent('cartUpdated');
    }
    
    return cart;
}

function removeFromCart(itemId) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
        cart.splice(index, 1);
        saveToLocalStorage('cart', cart);
        dispatchCustomEvent('cartUpdated');
    }
    
    return cart;
}

function clearCart() {
    saveToLocalStorage('cart', []);
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
    
    // Verifica se já existe um cupom com o mesmo código
    const existingCoupon = coupons.find(c => c.code === couponData.code);
    if (existingCoupon) {
        return { success: false, message: 'Já existe um cupom com este código' };
    }
    
    // Adiciona contador de uso ao cupom
    const newCoupon = {
        ...couponData,
        usageCount: 0
    };
    
    coupons.push(newCoupon);
    saveToLocalStorage('coupons', coupons);
    
    // Registra no histórico
    addToHistory('added', `Cupom ${couponData.code}`, `Cupom de ${couponData.discount}% criado`);
    
    return { success: true, coupon: newCoupon };
}

function removeCoupon(couponCode) {
    const coupons = getCoupons();
    const index = coupons.findIndex(c => c.code === couponCode);
    
    if (index !== -1) {
        const removedCoupon = coupons[index];
        coupons.splice(index, 1);
        saveToLocalStorage('coupons', coupons);
        
        // Registra no histórico
        addToHistory('removed', `Cupom ${couponCode}`, 'Cupom removido');
        return true;
    }
    
    return false;
}

function applyCoupon(couponCode) {
    const coupons = getCoupons();
    const coupon = coupons.find(c => c.code === couponCode);
    
    if (!coupon) {
        return { success: false, message: 'Cupom não encontrado' };
    }
    
    // Verifica se o cupom expirou
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    
    if (now > expiryDate) {
        return { success: false, message: 'Este cupom expirou' };
    }
    
    // Verifica se o cupom atingiu o limite de uso
    if (coupon.usageCount >= coupon.usageLimit) {
        return { success: false, message: 'Este cupom atingiu o limite de uso' };
    }
    
    // Aplica o cupom
    saveToLocalStorage('appliedCoupon', coupon);
    
    // Atualiza o contador de uso do cupom
    coupon.usageCount += 1;
    saveToLocalStorage('coupons', coupons);
    
    return { success: true, coupon };
}

function getAppliedCoupon() {
    return loadFromLocalStorage('appliedCoupon');
}

/**
 * Funções de gerenciamento de configurações
 */
function getSettings() {
    return loadFromLocalStorage('settings') || {
        whatsappNumber: '5511999999999',
        welcomeMessage: 'Olá! Gostaria de fazer um pedido:',
        adminPassword: 'draxx'
    };
}

function updateSettings(settings) {
    saveToLocalStorage('settings', settings);
    
    // Registra no histórico
    addToHistory('modified', 'Configurações', 'Configurações da loja atualizadas');
    
    return settings;
}

function verifyAdminPassword(password) {
    const settings = getSettings();
    return password === settings.adminPassword;
}

/**
 * Funções de gerenciamento de novidades
 */
function getNews() {
    return loadFromLocalStorage('news') || [];
}

function addNews(newsData) {
    const news = getNews();
    const newItem = {
        ...newsData,
        id: generateId()
    };
    news.push(newItem);
    saveToLocalStorage('news', news);
    
    // Registra no histórico
    addToHistory('added', `Novidade: ${newsData.title}`, 'Novidade adicionada');
    
    return newItem;
}

function updateNews(newsItem) {
    const news = getNews();
    const index = news.findIndex(n => n.id === newsItem.id);
    
    if (index !== -1) {
        news[index] = newsItem;
        saveToLocalStorage('news', news);
        
        // Registra no histórico
        addToHistory('modified', `Novidade: ${newsItem.title}`, 'Novidade atualizada');
        return true;
    }
    
    return false;
}

function removeNews(newsId) {
    const news = getNews();
    const index = news.findIndex(n => n.id === newsId);
    
    if (index !== -1) {
        const removedNews = news[index];
        news.splice(index, 1);
        saveToLocalStorage('news', news);
        
        // Registra no histórico
        addToHistory('removed', `Novidade: ${removedNews.title}`, 'Novidade removida');
        return true;
    }
    
    return false;
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
    
    history.unshift(historyItem); // Adiciona ao início da lista
    
    // Limita o histórico a 100 itens para não sobrecarregar o localStorage
    if (history.length > 100) {
        history.pop();
    }
    
    saveToLocalStorage('history', history);
    
    return historyItem;
}