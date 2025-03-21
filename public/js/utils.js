/**
 * Funções utilitárias da aplicação
 */

// Gerar ID único
function generateId() {
  return 'id-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Formatar moeda para BRL
function formatCurrency(value) {
  return value.toFixed(2).replace('.', ',');
}

// Formatar data para exibição
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Exibir mensagem de toast
function showToast(title, message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 'check_circle' : 'error';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <span class="material-icons">${icon}</span>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remover toast após 3 segundos
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Salvar dados no localStorage
function saveToLocalStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

// Carregar dados do localStorage
function loadFromLocalStorage(key) {
  try {
    const serializedData = localStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
    return null;
  }
}

// Remover dados do localStorage
function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error);
  }
}

// Criar evento personalizado
function dispatchCustomEvent(eventName) {
  window.dispatchEvent(new Event(eventName));
}

// Formatar data ISO para exibição de data e hora
function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Enviar pedido para WhatsApp
function sendToWhatsApp(cartItems, subtotal, discount, total, appliedCoupon) {
  const settings = loadFromLocalStorage('settings') || { whatsappNumber: '5511987654321', welcomeMessage: 'Olá! Obrigado pelo seu pedido.' };
  const whatsappNumber = settings.whatsappNumber;
  
  if (!whatsappNumber) {
    showToast('Erro', 'Número de WhatsApp não configurado na área administrativa.', 'error');
    return;
  }
  
  // Construir mensagem
  let message = settings.welcomeMessage ? `${settings.welcomeMessage}\n\n` : '';
  message += '*Meu Pedido:*\n\n';
  
  // Adicionar itens do carrinho
  cartItems.forEach(item => {
    message += `• ${item.name} (${item.quantity}x) - R$ ${formatCurrency(item.price * item.quantity)}\n`;
  });
  
  // Adicionar totais
  message += `\n*Subtotal:* R$ ${formatCurrency(subtotal)}`;
  
  if (discount > 0 && appliedCoupon) {
    message += `\n*Cupom Aplicado:* ${appliedCoupon.code} (${appliedCoupon.discount}%)`;
    message += `\n*Desconto:* - R$ ${formatCurrency(discount)}`;
  }
  
  message += `\n*Total:* R$ ${formatCurrency(total)}`;
  
  // Codificar mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Criar URL do WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Abrir WhatsApp em uma nova aba
  window.open(whatsappUrl, '_blank');
}