/**
 * Gera um ID único
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Formata um valor monetário para o formato brasileiro
 * @param {number} value - Valor a ser formatado
 */
function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Formata uma data ISO para o formato brasileiro
 * @param {string} dateString - Data no formato ISO
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

/**
 * Exibe uma notificação toast na tela
 * @param {string} title - Título da notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error)
 */
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon i');
    
    // Define o título e mensagem
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Define o ícone e cor baseado no tipo
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toastIcon.style.color = 'var(--success-color)';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toastIcon.style.color = 'var(--danger-color)';
    }
    
    // Exibe o toast
    toast.style.display = 'flex';
    
    // Esconde o toast após 3 segundos
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * Salva dados no localStorage
 * @param {string} key - Chave para armazenamento
 * @param {any} data - Dados a serem armazenados
 */
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Carrega dados do localStorage
 * @param {string} key - Chave para recuperação
 */
function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Remove dados do localStorage
 * @param {string} key - Chave para remoção
 */
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Dispara um evento personalizado
 * @param {string} eventName - Nome do evento
 */
function dispatchCustomEvent(eventName) {
    const event = new Event(eventName);
    document.dispatchEvent(event);
}

/**
 * Formata data e hora ISO para o formato brasileiro
 * @param {string} isoString - Data no formato ISO
 */
function formatDateTime(isoString) {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

/**
 * Envia pedido para o WhatsApp
 * @param {Array} cartItems - Itens do carrinho
 * @param {number} subtotal - Subtotal da compra
 * @param {number} discount - Valor do desconto
 * @param {number} total - Total da compra
 * @param {Object} appliedCoupon - Cupom aplicado
 */
function sendToWhatsApp(cartItems, subtotal, discount, total, appliedCoupon) {
    // Carrega as configurações da loja
    const settings = loadFromLocalStorage('settings') || { whatsappNumber: '5511999999999', welcomeMessage: 'Olá! Gostaria de fazer um pedido:' };
    
    // Monta a mensagem
    let message = settings.welcomeMessage + '\n\n';
    message += '*ITENS DO PEDIDO:*\n';
    
    cartItems.forEach(item => {
        message += `• ${item.name} (${item.quantity}x) - ${formatCurrency(item.price * item.quantity)}\n`;
    });
    
    message += '\n*RESUMO:*\n';
    message += `Subtotal: ${formatCurrency(subtotal)}\n`;
    
    if (discount > 0) {
        message += `Desconto: ${formatCurrency(discount)}`;
        if (appliedCoupon) {
            message += ` (Cupom: ${appliedCoupon.code})\n`;
        } else {
            message += '\n';
        }
    }
    
    message += `*Total: ${formatCurrency(total)}*`;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Cria o link do WhatsApp
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;
    
    // Abre o link em uma nova aba
    window.open(whatsappUrl, '_blank');
}