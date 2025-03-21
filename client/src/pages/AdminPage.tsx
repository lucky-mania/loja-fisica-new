import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  removeProduct,
  getCoupons, 
  addCoupon, 
  removeCoupon,
  getSettings,
  updateSettings,
  getHistory
} from "@/lib/store";
import { Product, Coupon, HistoryItem, StoreSettings } from "@/lib/types";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    whatsappNumber: "",
    welcomeMessage: "",
    adminPassword: "draxx"
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load initial data
    loadData();
    
    // Add event listeners for data changes
    window.addEventListener('productsUpdated', loadProducts);
    window.addEventListener('couponsUpdated', loadCoupons);
    window.addEventListener('historyUpdated', loadHistory);
    window.addEventListener('settingsUpdated', loadSettings);
    
    return () => {
      window.removeEventListener('productsUpdated', loadProducts);
      window.removeEventListener('couponsUpdated', loadCoupons);
      window.removeEventListener('historyUpdated', loadHistory);
      window.removeEventListener('settingsUpdated', loadSettings);
    };
  }, []);
  
  const loadData = () => {
    loadProducts();
    loadCoupons();
    loadHistory();
    loadSettings();
  };
  
  const loadProducts = () => {
    const storeProducts = getProducts();
    setProducts(storeProducts);
  };
  
  const loadCoupons = () => {
    const storeCoupons = getCoupons();
    setCoupons(storeCoupons);
  };
  
  const loadHistory = () => {
    const storeHistory = getHistory();
    setHistory(storeHistory);
  };
  
  const loadSettings = () => {
    const storeSettings = getSettings();
    setSettings(storeSettings);
  };
  
  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const productData = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      imageUrl: formData.get('imageUrl') as string,
      description: formData.get('description') as string || '',
    };
    
    if (editingProduct) {
      // Update existing product
      updateProduct({
        ...productData,
        id: editingProduct.id
      });
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso",
      });
      setEditingProduct(null);
    } else {
      // Add new product
      addProduct(productData);
      toast({
        title: "Produto adicionado",
        description: "Novo produto adicionado com sucesso",
      });
    }
    
    form.reset();
    loadProducts();
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab("products");
    
    // Scroll to form
    setTimeout(() => {
      const form = document.getElementById('addProductForm');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      removeProduct(productId);
      toast({
        title: "Produto removido",
        description: "O produto foi removido com sucesso",
      });
      loadProducts();
    }
  };
  
  const handleCouponSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const couponData = {
      code: formData.get('code') as string,
      discount: parseInt(formData.get('discount') as string),
      expiryDate: formData.get('expiryDate') as string,
      usageLimit: parseInt(formData.get('usageLimit') as string),
      usageCount: 0
    };
    
    addCoupon(couponData);
    toast({
      title: "Cupom criado",
      description: "Novo cupom criado com sucesso",
    });
    
    form.reset();
    loadCoupons();
  };
  
  const handleDeleteCoupon = (couponCode: string) => {
    if (window.confirm("Tem certeza que deseja desativar este cupom?")) {
      removeCoupon(couponCode);
      toast({
        title: "Cupom desativado",
        description: "O cupom foi desativado com sucesso",
      });
      loadCoupons();
    }
  };
  
  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const settingsData = {
      whatsappNumber: formData.get('whatsappNumber') as string,
      welcomeMessage: formData.get('welcomeMessage') as string,
      adminPassword: formData.get('adminPassword') as string || settings.adminPassword
    };
    
    updateSettings(settingsData);
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso",
    });
    
    loadSettings();
  };
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section id="admin">
        <h2 className="text-3xl font-heading font-bold mb-8 text-neutral-dark">Área Administrativa</h2>
        
        {/* Admin navigation tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button 
                className={`inline-block p-4 border-b-2 ${activeTab === 'products' ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary hover:border-gray-300'}`}
                onClick={() => setActiveTab('products')}
              >
                Produtos
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 border-b-2 ${activeTab === 'coupons' ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary hover:border-gray-300'}`}
                onClick={() => setActiveTab('coupons')}
              >
                Cupons
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 border-b-2 ${activeTab === 'settings' ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary hover:border-gray-300'}`}
                onClick={() => setActiveTab('settings')}
              >
                Configurações
              </button>
            </li>
            <li>
              <button 
                className={`inline-block p-4 border-b-2 ${activeTab === 'history' ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary hover:border-gray-300'}`}
                onClick={() => setActiveTab('history')}
              >
                Histórico
              </button>
            </li>
          </ul>
        </div>
        
        {/* Products Tab */}
        <div id="productsTab" className={activeTab === 'products' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-heading font-semibold mb-4">
              {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h3>
            <form id="addProductForm" className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleProductSubmit}>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                  defaultValue={editingProduct?.name}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Preço (R$)</label>
                <input 
                  type="number" 
                  name="price"
                  step="0.01" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                  defaultValue={editingProduct?.price}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Categoria</label>
                <select 
                  name="category"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                  defaultValue={editingProduct?.category}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Camisetas">Camisetas</option>
                  <option value="Calças">Calças</option>
                  <option value="Vestidos">Vestidos</option>
                  <option value="Acessórios">Acessórios</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Imagem URL</label>
                <input 
                  type="url" 
                  name="imageUrl"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                  defaultValue={editingProduct?.imageUrl}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Descrição</label>
                <textarea 
                  name="description"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  rows={3}
                  defaultValue={editingProduct?.description}
                ></textarea>
              </div>
              <div className="col-span-2 flex gap-2">
                <button 
                  type="submit" 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  {editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
                </button>
                
                {editingProduct && (
                  <button 
                    type="button" 
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-heading font-semibold mb-4">Gerenciar Produtos</h3>
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum produto cadastrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Preço</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 object-cover rounded-full" 
                                src={product.imageUrl} 
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-dark">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark">R$ {product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-primary hover:text-opacity-80 mr-3"
                            onClick={() => handleEditProduct(product)}
                          >
                            Editar
                          </button>
                          <button 
                            className="text-secondary hover:text-opacity-80"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Coupons Tab */}
        <div id="couponsTab" className={activeTab === 'coupons' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-heading font-semibold mb-4">Criar Novo Cupom</h3>
            <form id="addCouponForm" className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCouponSubmit}>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Código do Cupom</label>
                <input 
                  type="text" 
                  name="code"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Desconto (%)</label>
                <input 
                  type="number" 
                  name="discount"
                  min="1" 
                  max="100" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Data de Validade</label>
                <input 
                  type="date" 
                  name="expiryDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Limite de Usos</label>
                <input 
                  type="number" 
                  name="usageLimit"
                  min="1" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                />
              </div>
              <div className="col-span-2">
                <button 
                  type="submit" 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Criar Cupom
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-heading font-semibold mb-4">Cupons Ativos</h3>
            {coupons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum cupom ativo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Desconto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Validade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Usos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                      <tr key={coupon.code}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-dark">{coupon.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark">{coupon.discount}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark">{new Date(coupon.expiryDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark">{coupon.usageCount}/{coupon.usageLimit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-secondary hover:text-opacity-80"
                            onClick={() => handleDeleteCoupon(coupon.code)}
                          >
                            Desativar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Settings Tab */}
        <div id="settingsTab" className={activeTab === 'settings' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-heading font-semibold mb-4">Configurações da Loja</h3>
            <form id="storeSettingsForm" className="space-y-6" onSubmit={handleSettingsSubmit}>
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Número do WhatsApp (com DDD)</label>
                <input 
                  type="tel" 
                  name="whatsappNumber"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="5511987654321" 
                  required
                  defaultValue={settings.whatsappNumber}
                />
                <p className="mt-1 text-sm text-gray-500">Digite o número completo incluindo o código do país (ex: 5511987654321)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Mensagem de Boas-Vindas</label>
                <textarea 
                  name="welcomeMessage"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  rows={2} 
                  placeholder="Olá! Seja bem-vindo à nossa loja!"
                  defaultValue={settings.welcomeMessage}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Alterar Senha Admin</label>
                <input 
                  type="password" 
                  name="adminPassword"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Nova senha"
                />
                <p className="mt-1 text-sm text-gray-500">Deixe em branco para manter a senha atual</p>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* History Tab */}
        <div id="historyTab" className={activeTab === 'history' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-heading font-semibold mb-4">Histórico de Alterações</h3>
            
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum registro no histórico.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Ação</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark">{new Date(item.timestamp).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.action === 'added' ? 'bg-green-100 text-green-800' : 
                            item.action === 'modified' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.action === 'added' ? 'Adicionado' : 
                             item.action === 'modified' ? 'Modificado' : 
                             'Removido'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark">{item.itemName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark">{item.details}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
