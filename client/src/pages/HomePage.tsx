import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/ui/Filters";
import { getProducts } from "@/lib/store";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  useEffect(() => {
    // Load products from store
    const loadProducts = () => {
      const storeProducts = getProducts();
      setProducts(storeProducts);
      setFilteredProducts(storeProducts);
    };
    
    loadProducts();
    
    // Add event listener to update products when storage changes
    window.addEventListener('productsUpdated', loadProducts);
    
    return () => {
      window.removeEventListener('productsUpdated', loadProducts);
    };
  }, []);
  
  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    
    if (category === "Todos") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  };
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section id="home">
        <h2 className="text-3xl font-heading font-bold mb-8 text-neutral-dark">Produtos em Destaque</h2>
        
        <Filters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-12 mt-6">
            <span className="material-icons text-5xl text-gray-300 mb-2">inventory_2</span>
            <p className="text-gray-500 text-center">Nenhum produto encontrado nesta categoria.</p>
            {activeFilter !== "Todos" && (
              <button 
                onClick={() => handleFilterChange("Todos")} 
                className="mt-4 text-primary hover:underline"
              >
                Ver todos os produtos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
