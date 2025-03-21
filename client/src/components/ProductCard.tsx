import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/store";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    addToCart(product);
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho!`,
    });
  };
  
  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-heading font-semibold">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
          <button 
            className="add-to-cart bg-secondary text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
            onClick={handleAddToCart}
          >
            <span className="material-icons">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
