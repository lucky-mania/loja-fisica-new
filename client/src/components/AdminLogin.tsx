import { useState } from "react";
import { verifyAdminPassword } from "@/lib/store";

interface AdminLoginProps {
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

export default function AdminLogin({ onClose, onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = verifyAdminPassword(password);
    
    if (isValid) {
      // Save admin session to localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        authenticated: true,
        timestamp: new Date().toISOString()
      }));
      
      onLogin(true);
    } else {
      setError(true);
      onLogin(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="modal bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-heading font-semibold">Acesso Administrativo</h3>
          <button 
            className="text-neutral-dark hover:text-secondary"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-dark mb-1">Senha de Administrador</label>
              <input 
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="mb-4 text-secondary">
                Senha incorreta. Tente novamente.
              </div>
            )}
            <button 
              type="submit" 
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
