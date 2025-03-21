/**
 * Inicializa o carrinho e seus eventos
 */
function initializeCart() {
    // Elementos do DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscount = document.getElementById('cart-discount');
    const cartTotal = document.getElementById('cart-total');
    const discountContainer = document.getElementById('discount-container');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-input');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Event listeners
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    applyCouponBtn.addEventListener('click', handleApplyCoupon);
    clearCartBtn.addEventListener('click', () => {
        clearCart();
        loadCartItems();
        showToast('Carrinho limpo', 'Todos os produtos foram removidos do carrinho.');
    });
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Fecha o modal ao clicar fora dele
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCart();
        }
    });
    
    // Atualiza o contador do carrinho quando ele for modificado
    document.addEventListener('cartUpdated', () => {
        const cartBadge = document.getElementById('cart-badge');
        cartBadge.textContent = getCartCount();
    });
    
    // Inicializa o contador do carrinho
    document.dispatchEvent(new Event('cartUpdated'));
}

/**
 * Abre o modal do carrinho
 */
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    loadCartItems();
}

/**
 * Fecha o modal do carrinho
 */
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
    
    // Limpa o campo de cupom ao fechar
    document.getElementById('coupon-input').value = '';
}

/**
 * Carrega os itens do carrinho no modal
 */
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = getCart();
    
    // Limpa o conteúdo atual
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        
        // Atualiza os totais
        updateCartTotals(0, 0);
        return;
    }
    
    // Calcula o subtotal
    let subtotal = 0;
    
    // Adiciona cada item ao carrinho
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Adiciona event listeners para os botões de quantidade e remoção
    const decreaseBtns = cartItemsContainer.querySelectorAll('.decrease-btn');
    const increaseBtns = cartItemsContainer.querySelectorAll('.increase-btn');
    const removeBtns = cartItemsContainer.querySelectorAll('.cart-item-remove');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.getAttribute('data-id');
            updateCartItemQuantity(itemId, -1);
            loadCartItems();
        });
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.getAttribute('data-id');
            updateCartItemQuantity(itemId, 1);
            loadCartItems();
        });
    });
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.getAttribute('data-id');
            removeFromCart(itemId);
            loadCartItems();
        });
    });
    
    // Verifica se há cupom aplicado e atualiza os totais
    const appliedCoupon = getAppliedCoupon();
    let discount = 0;
    
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
        document.getElementById('coupon-input').value = appliedCoupon.code;
    }
    
    updateCartTotals(subtotal, discount);
}

/**
 * Atualiza os totais do carrinho
 * @param {number} subtotal - Subtotal do carrinho
 * @param {number} discount - Valor do desconto
 */
function updateCartTotals(subtotal, discount) {
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscount = document.getElementById('cart-discount');
    const cartTotal = document.getElementById('cart-total');
    const discountContainer = document.getElementById('discount-container');
    
    cartSubtotal.textContent = formatCurrency(subtotal);
    
    if (discount > 0) {
        cartDiscount.textContent = `- ${formatCurrency(discount)}`;
        discountContainer.style.display = 'flex';
    } else {
        discountContainer.style.display = 'none';
    }
    
    const total = subtotal - discount;
    cartTotal.textContent = formatCurrency(total);
}

/**
 * Manipula a aplicação de cupom
 */
function handleApplyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponCode = couponInput.value.trim();
    
    if (!couponCode) {
        showToast('Atenção', 'Digite um código de cupom válido.', 'error');
        return;
    }
    
    // Remove qualquer cupom existente
    removeFromLocalStorage('appliedCoupon');
    
    // Tenta aplicar o cupom
    const result = applyCoupon(couponCode);
    
    if (result.success) {
        showToast('Cupom aplicado', `Desconto de ${result.coupon.discount}% aplicado com sucesso!`);
        loadCartItems(); // Atualiza os totais
    } else {
        showToast('Erro', result.message, 'error');
        couponInput.value = '';
    }
}

/**
 * Remove o cupom aplicado ao carrinho
 */
function removeCouponFromCart() {
    removeFromLocalStorage('appliedCoupon');
    document.getElementById('coupon-input').value = '';
    loadCartItems(); // Atualiza os totais
    showToast('Cupom removido', 'O cupom foi removido do carrinho.');
}

/**
 * Manipula a finalização da compra
 */
function handleCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showToast('Atenção', 'Seu carrinho está vazio.', 'error');
        return;
    }
    
    // Calcula subtotal, desconto e total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const appliedCoupon = getAppliedCoupon();
    let discount = 0;
    
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
    }
    
    const total = subtotal - discount;
    
    // Envia pedido para o WhatsApp
    sendToWhatsApp(cart, subtotal, discount, total, appliedCoupon);
    
    // Limpa o carrinho após o envio
    clearCart();
    closeCart();
    
    showToast('Pedido enviado', 'Seu pedido foi enviado com sucesso para o WhatsApp!');
}