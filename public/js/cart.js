/**
 * Gerenciamento do carrinho de compras
 */

// Elementos do carrinho
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotalElement = document.getElementById('cartSubtotal');
const cartDiscountElement = document.getElementById('cartDiscount');
const cartTotalElement = document.getElementById('cartTotal');
const discountRowElement = document.getElementById('discountRow');
const couponInput = document.getElementById('couponInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Valores do carrinho
let cartSubtotal = 0;
let cartDiscount = 0;
let cartTotal = 0;

// Inicializar carrinho
function initializeCart() {
  // Adicionar event listeners
  cartBtn.addEventListener('click', openCart);
  cartModal.querySelector('.close-btn').addEventListener('click', closeCart);
  applyCouponBtn.addEventListener('click', handleApplyCoupon);
  checkoutBtn.addEventListener('click', handleCheckout);
  
  // Fechar modal quando clicar fora do conteúdo
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      closeCart();
    }
  });
  
  // Escutar tecla ESC para fechar modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
      closeCart();
    }
  });
  
  // Escutar eventos de atualização do carrinho
  window.addEventListener('cartUpdated', () => {
    if (cartModal.classList.contains('active')) {
      loadCartItems();
    }
  });
}

// Abrir modal do carrinho
function openCart() {
  cartModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Evitar scroll da página
  loadCartItems();
}

// Fechar modal do carrinho
function closeCart() {
  cartModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Carregar itens do carrinho
function loadCartItems() {
  const cartItems = getCart();
  
  // Limpar itens existentes
  cartItemsContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    // Exibir mensagem de carrinho vazio
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <span class="material-icons">shopping_cart</span>
        <p>Seu carrinho está vazio</p>
        <button class="continue-shopping" onclick="closeCart()">
          Continuar Comprando
        </button>
      </div>
    `;
    
    // Zerar totais
    updateCartTotals(0, 0);
    return;
  }
  
  // Calcular subtotal
  cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Adicionar itens do carrinho
  cartItems.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    
    cartItemElement.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">R$ ${formatCurrency(item.price)}</div>
        </div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="quantity-btn minus-btn" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn plus-btn">+</button>
        </div>
        <button class="remove-item-btn">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `;
    
    // Adicionar event listeners
    cartItemElement.querySelector('.minus-btn').addEventListener('click', () => {
      if (item.quantity > 1) {
        updateCartItemQuantity(item.id, -1);
      }
    });
    
    cartItemElement.querySelector('.plus-btn').addEventListener('click', () => {
      updateCartItemQuantity(item.id, 1);
    });
    
    cartItemElement.querySelector('.remove-item-btn').addEventListener('click', () => {
      removeFromCart(item.id);
    });
    
    cartItemsContainer.appendChild(cartItemElement);
  });
  
  // Verificar cupom aplicado e atualizar totais
  const appliedCoupon = getAppliedCoupon();
  
  if (appliedCoupon) {
    const discountAmount = (cartSubtotal * appliedCoupon.discount) / 100;
    updateCartTotals(cartSubtotal, discountAmount);
    
    // Mostrar código do cupom no input
    couponInput.value = appliedCoupon.code;
    couponInput.disabled = true;
    applyCouponBtn.textContent = 'Remover';
    applyCouponBtn.onclick = removeCouponFromCart;
  } else {
    updateCartTotals(cartSubtotal, 0);
    
    // Limpar input do cupom
    couponInput.value = '';
    couponInput.disabled = false;
    applyCouponBtn.textContent = 'Aplicar';
    applyCouponBtn.onclick = handleApplyCoupon;
  }
}

// Atualizar totais do carrinho
function updateCartTotals(subtotal, discount) {
  cartSubtotal = subtotal;
  cartDiscount = discount;
  cartTotal = subtotal - discount;
  
  // Atualizar elementos da interface
  cartSubtotalElement.textContent = `R$ ${formatCurrency(subtotal)}`;
  
  if (discount > 0) {
    cartDiscountElement.textContent = `- R$ ${formatCurrency(discount)}`;
    discountRowElement.classList.remove('hidden');
  } else {
    discountRowElement.classList.add('hidden');
  }
  
  cartTotalElement.textContent = `R$ ${formatCurrency(cartTotal)}`;
}

// Aplicar cupom ao carrinho
function handleApplyCoupon() {
  const code = couponInput.value.trim().toUpperCase();
  
  if (!code) {
    showToast('Erro', 'Por favor, insira um código de cupom', 'error');
    return;
  }
  
  const result = applyCoupon(code);
  
  if (result.success) {
    showToast('Cupom aplicado', `Cupom ${code} aplicado com sucesso!`);
    loadCartItems();
  } else {
    showToast('Erro', result.message, 'error');
  }
}

// Remover cupom do carrinho
function removeCouponFromCart() {
  removeFromLocalStorage('appliedCoupon');
  dispatchCustomEvent('cartUpdated');
  showToast('Cupom removido', 'Cupom removido do carrinho');
  loadCartItems();
}

// Finalizar compra
function handleCheckout() {
  const cartItems = getCart();
  
  if (cartItems.length === 0) {
    showToast('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar', 'error');
    return;
  }
  
  const appliedCoupon = getAppliedCoupon();
  
  // Enviar pedido para WhatsApp
  sendToWhatsApp(cartItems, cartSubtotal, cartDiscount, cartTotal, appliedCoupon);
  
  // Limpar carrinho
  clearCart();
  
  // Fechar modal do carrinho
  closeCart();
  
  // Exibir mensagem de sucesso
  showToast('Pedido enviado', 'Seu pedido foi enviado para o WhatsApp da loja');
}