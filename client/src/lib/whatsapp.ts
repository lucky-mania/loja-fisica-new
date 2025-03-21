import { getSettings } from './store';
import { CartItem, Coupon } from './types';

// Format currency to BRL
const formatCurrency = (value: number): string => {
  return value.toFixed(2).replace('.', ',');
};

// Send cart to WhatsApp
export const sendToWhatsApp = (
  cartItems: CartItem[],
  subtotal: number,
  discount: number,
  total: number,
  appliedCoupon: Coupon | null
): void => {
  const settings = getSettings();
  const whatsappNumber = settings.whatsappNumber;
  
  if (!whatsappNumber) {
    alert('Erro: Número de WhatsApp não configurado na área administrativa.');
    return;
  }
  
  // Build message
  let message = settings.welcomeMessage ? `${settings.welcomeMessage}\n\n` : '';
  message += '*Meu Pedido:*\n\n';
  
  // Add cart items
  cartItems.forEach(item => {
    message += `• ${item.name} (${item.quantity}x) - R$ ${formatCurrency(item.price * item.quantity)}\n`;
  });
  
  // Add totals
  message += `\n*Subtotal:* R$ ${formatCurrency(subtotal)}`;
  
  if (discount > 0 && appliedCoupon) {
    message += `\n*Cupom Aplicado:* ${appliedCoupon.code} (${appliedCoupon.discount}%)`;
    message += `\n*Desconto:* - R$ ${formatCurrency(discount)}`;
  }
  
  message += `\n*Total:* R$ ${formatCurrency(total)}`;
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
};
