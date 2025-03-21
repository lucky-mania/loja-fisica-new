import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import AdminLogin from "@/components/AdminLogin";
import CartModal from "@/components/CartModal";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";
import { initializeStore } from "@/lib/store";
import { loadFromLocalStorage } from "@/lib/localStorage";

function Router() {
  const [location, setLocation] = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize the store with data from localStorage
    initializeStore();
    
    // Check if admin session exists
    const adminSession = loadFromLocalStorage('adminSession');
    if (adminSession && adminSession.authenticated) {
      setIsAdmin(true);
    }
  }, []);
  
  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setLocation("/admin");
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo à área administrativa",
      });
    } else {
      toast({
        title: "Falha no login",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminSession');
    setLocation("/");
    toast({
      title: "Logout realizado",
      description: "Você saiu da área administrativa",
    });
  };

  return (
    <>
      <Header 
        onAdminClick={() => setShowAdminLogin(true)}
        onCartClick={() => setShowCart(true)}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      
      {showAdminLogin && (
        <AdminLogin 
          onClose={() => setShowAdminLogin(false)}
          onLogin={handleAdminLogin}
        />
      )}
      
      {showCart && (
        <CartModal 
          onClose={() => setShowCart(false)}
        />
      )}
      
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/admin">
          {isAdmin ? <AdminPage /> : () => {
            setShowAdminLogin(true);
            setLocation("/");
            return null;
          }}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
