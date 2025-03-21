import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  applyCoupon, 
  getAppliedCoupon,
  clearCart 
} from "@/lib/store";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { CartItem, Coupon } from "@/lib/types";

interface CartModalProps {
  onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    loadCartData();
    
    // Add event listener for cart updates
    window.addEventListener('cartUpdated', loadCartData);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCartData);
    };
  }, []);
  
  const loadCartData = () => {
    const cart = getCart();
    setCartItems(cart);
    
    // Calculate totals
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(cartSubtotal);
    
    // Check for applied coupon
    const coupon = getAppliedCoupon();
    setAppliedCoupon(coupon);
    
    if (coupon) {
      const discountAmount = (cartSubtotal * coupon.discount) / 100;
      setDiscount(discountAmount);
      setTotal(cartSubtotal - discountAmount);
    } else {
      setDiscount(0);
      setTotal(cartSubtotal);
    }
  };
  
  const handleQuantityChange = (itemId: string, change: number) => {
    updateCartItemQuantity(itemId, change);
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um código de cupom",
        variant: "destructive",
      });
      return;
    }
    
    const result = applyCoupon(couponCode.trim().toUpperCase());
    
    if (result.success) {
      toast({
        title: "Cupom aplicado",
        description: `Cupom ${couponCode} aplicado com sucesso!`,
      });
      setCouponCode("");
      loadCartData();
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      });
    }
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar",
        variant: "destructive",
      });
      return;
    }
    
    sendToWhatsApp(cartItems, subtotal, discount, total, appliedCoupon);
    clearCart();
    onClose();
    
    toast({
      title: "Pedido enviado",
      description: "Seu pedido foi enviado para o WhatsApp da loja",
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="modal bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-heading font-semibold">Seu Carrinho</h3>
          <button 
            className="text-neutral-dark hover:text-secondary"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="material-icons text-5xl text-gray-300 mb-2">shopping_cart</span>
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <button 
                className="mt-4 text-primary hover:underline"
                onClick={onClose}
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item flex justify-between items-center py-3 border-b">
                  <div className="flex items-center">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-3">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      <button 
                        className="quantity-btn px-2 py-1 bg-gray-200 rounded-l-md"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
                      <button 
                        className="quantity-btn px-2 py-1 bg-gray-200 rounded-r-md"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-item text-secondary"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Coupon code */}
        <div className="p-4 border-t border-b">
          <div className="flex">
            <input 
              type="text" 
              placeholder="Código de cupom" 
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button 
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors"
              onClick={handleApplyCoupon}
            >
              Aplicar
            </button>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="p-4 border-b">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Desconto</span>
              <span>- R$ {discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Checkout button */}
        <div className="p-4">
          <button 
            className="w-full bg-secondary text-white py-3 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
            onClick={handleCheckout}
          >
            <span className="material-icons mr-2">whatsapp</span>
            <span>Finalizar pelo WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
