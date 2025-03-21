import { useState } from "react";
import { Link, useLocation } from "wouter";
import { getCartCount } from "@/lib/store";

interface HeaderProps {
  onAdminClick: () => void;
  onCartClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Header({ onAdminClick, onCartClick, isAdmin, onLogout }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  
  // Update cart count when it changes
  window.addEventListener('cartUpdated', () => {
    setCartCount(getCartCount());
  });
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-heading font-bold text-primary mr-6 cursor-pointer">Fashion Store</h1>
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/">
                    <a className={`${location === '/' ? 'text-primary' : 'text-neutral-dark'} hover:text-primary transition-colors`}>Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className={`${location === '/about' ? 'text-primary' : 'text-neutral-dark'} hover:text-primary transition-colors`}>Sobre</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link href="/admin">
                  <a className={`hidden md:flex items-center ${location.startsWith('/admin') ? 'text-primary' : 'text-neutral-dark'} hover:text-primary transition-colors`}>
                    <span className="material-icons mr-1">admin_panel_settings</span>
                    <span>Admin</span>
                  </a>
                </Link>
                <button 
                  className="hidden md:flex items-center text-neutral-dark hover:text-primary transition-colors"
                  onClick={onLogout}
                >
                  <span className="material-icons mr-1">logout</span>
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <button 
                id="adminBtn" 
                className="hidden md:flex items-center text-neutral-dark hover:text-primary transition-colors"
                onClick={onAdminClick}
              >
                <span className="material-icons mr-1">admin_panel_settings</span>
                <span>Admin</span>
              </button>
            )}
            <div className="relative">
              <button 
                id="cartBtn" 
                className="flex items-center text-neutral-dark hover:text-primary transition-colors"
                onClick={onCartClick}
              >
                <span className="material-icons">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
            </div>
            <button 
              id="mobileMenuBtn" 
              className="md:hidden text-neutral-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-icons">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden bg-white ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3">
          <ul className="space-y-3">
            <li>
              <Link href="/">
                <a 
                  className="block text-neutral-dark hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a 
                  className="block text-neutral-dark hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sobre
                </a>
              </Link>
            </li>
            {isAdmin ? (
              <>
                <li>
                  <Link href="/admin">
                    <a 
                      className="block text-neutral-dark hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </a>
                  </Link>
                </li>
                <li>
                  <button 
                    className="block w-full text-left text-neutral-dark hover:text-primary transition-colors"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button 
                  className="block w-full text-left text-neutral-dark hover:text-primary transition-colors"
                  onClick={() => {
                    onAdminClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  Admin
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
