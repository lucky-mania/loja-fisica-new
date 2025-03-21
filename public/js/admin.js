/**
 * Gerenciamento da área administrativa
 */

// Elementos do admin
const adminBtn = document.getElementById('adminBtn');
const adminMobileBtn = document.getElementById('adminMobileBtn');
const adminFooterBtn = document.getElementById('adminFooterBtn');
const adminModal = document.getElementById('adminModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginError = document.getElementById('adminLoginError');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');

// Elementos dos formulários
const addProductForm = document.getElementById('addProductForm');
const editProductId = document.getElementById('editProductId');
const productFormTitle = document.getElementById('productFormTitle');
const saveProductBtn = document.getElementById('saveProductBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const productsTable = document.getElementById('productsTable');
const noProductsMessage = document.getElementById('noProductsMessage');

const addCouponForm = document.getElementById('addCouponForm');
const couponsTable = document.getElementById('couponsTable');
const noCouponsMessage = document.getElementById('noCouponsMessage');

const settingsForm = document.getElementById('settingsForm');
const historyList = document.getElementById('historyList');
const noHistoryMessage = document.getElementById('noHistoryMessage');

// Estado da administração
let isAdminLoggedIn = false;
let activeAdminTab = 'products';

// Inicializar admin
function initializeAdmin() {
  // Verificar se existe sessão de admin
  checkAdminSession();
  
  // Adicionar event listeners
  adminBtn.addEventListener('click', openAdminLogin);
  adminMobileBtn.addEventListener('click', openAdminLogin);
  adminFooterBtn.addEventListener('click', openAdminLogin);
  adminModal.querySelector('.close-btn').addEventListener('click', closeAdminLogin);
  adminLoginForm.addEventListener('submit', handleAdminLogin);
  logoutBtn.addEventListener('click', handleLogout);
  
  // Fechar modal quando clicar fora do conteúdo
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
      closeAdminLogin();
    }
  });
  
  // Escutar tecla ESC para fechar modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModal.classList.contains('active')) {
      closeAdminLogin();
    }
  });
  
  // Configurar formulário de produtos
  addProductForm.addEventListener('submit', handleProductSubmit);
  cancelEditBtn.addEventListener('click', cancelProductEdit);
  
  // Configurar formulário de cupons
  addCouponForm.addEventListener('submit', handleCouponSubmit);
  
  // Configurar formulário de configurações
  settingsForm.addEventListener('submit', handleSettingsSubmit);
  
  // Configurar abas de admin
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      setActiveAdminTab(tabName);
    });
  });
  
  // Escutar eventos de atualização
  window.addEventListener('productsUpdated', loadProductsTable);
  window.addEventListener('couponsUpdated', loadCouponsTable);
  window.addEventListener('historyUpdated', loadHistoryList);
  window.addEventListener('settingsUpdated', loadSettingsForm);
}

// Verificar sessão de admin
function checkAdminSession() {
  const adminSession = loadFromLocalStorage('adminSession');
  
  if (adminSession && adminSession.authenticated) {
    isAdminLoggedIn = true;
    adminPanel.classList.remove('hidden');
    
    // Carregar dados da área administrativa
    loadAdminData();
  } else {
    isAdminLoggedIn = false;
    adminPanel.classList.add('hidden');
  }
}

// Abrir modal de login admin
function openAdminLogin() {
  // Se já estiver logado, mostrar painel em vez de login
  if (isAdminLoggedIn) {
    adminPanel.classList.remove('hidden');
    window.scrollTo({
      top: adminPanel.offsetTop - 80,
      behavior: 'smooth'
    });
    return;
  }
  
  adminModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Evitar scroll da página
  
  // Limpar formulário
  adminLoginForm.reset();
  adminLoginError.classList.add('hidden');
}

// Fechar modal de login admin
function closeAdminLogin() {
  adminModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Lidar com login do admin
function handleAdminLogin(e) {
  e.preventDefault();
  
  const password = document.getElementById('adminPassword').value;
  const isValid = verifyAdminPassword(password);
  
  if (isValid) {
    // Salvar sessão do admin no localStorage
    saveToLocalStorage('adminSession', {
      authenticated: true,
      timestamp: new Date().toISOString()
    });
    
    isAdminLoggedIn = true;
    closeAdminLogin();
    
    adminPanel.classList.remove('hidden');
    
    // Carregar dados da área administrativa
    loadAdminData();
    
    // Rolar para o painel de admin
    window.scrollTo({
      top: adminPanel.offsetTop - 80,
      behavior: 'smooth'
    });
    
    showToast('Login bem-sucedido', 'Bem-vindo à área administrativa');
  } else {
    adminLoginError.classList.remove('hidden');
    showToast('Falha no login', 'Senha incorreta. Tente novamente.', 'error');
  }
}

// Lidar com logout
function handleLogout() {
  removeFromLocalStorage('adminSession');
  isAdminLoggedIn = false;
  adminPanel.classList.add('hidden');
  
  showToast('Logout realizado', 'Você saiu da área administrativa');
  
  // Rolar para o topo da página
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Carregar todos os dados da área administrativa
function loadAdminData() {
  loadProductsTable();
  loadCouponsTable();
  loadHistoryList();
  loadSettingsForm();
}

// Definir aba ativa de admin
function setActiveAdminTab(tabName) {
  activeAdminTab = tabName;
  
  // Atualizar classes de botões
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  
  // Atualizar conteúdo visível
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}Tab`);
  });
}

/**
 * Gerenciamento de produtos
 */

// Lidar com envio do formulário de produtos
function handleProductSubmit(e) {
  e.preventDefault();
  
  const productData = {
    name: document.getElementById('productName').value,
    price: parseFloat(document.getElementById('productPrice').value),
    category: document.getElementById('productCategory').value,
    imageUrl: document.getElementById('productImage').value,
    description: document.getElementById('productDescription').value || ''
  };
  
  if (editProductId.value) {
    // Atualizar produto existente
    updateProduct({
      ...productData,
      id: editProductId.value
    });
    
    showToast('Produto atualizado', 'O produto foi atualizado com sucesso');
    resetProductForm();
  } else {
    // Adicionar novo produto
    addProduct(productData);
    
    showToast('Produto adicionado', 'Novo produto adicionado com sucesso');
    resetProductForm();
  }
}

// Cancelar edição de produto
function cancelProductEdit() {
  resetProductForm();
}

// Resetar formulário de produto
function resetProductForm() {
  addProductForm.reset();
  editProductId.value = '';
  productFormTitle.textContent = 'Adicionar Novo Produto';
  saveProductBtn.textContent = 'Adicionar Produto';
  cancelEditBtn.classList.add('hidden');
}

// Editar produto
function editProduct(productId) {
  const product = getProducts().find(p => p.id === productId);
  
  if (product) {
    // Preencher formulário
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.imageUrl;
    document.getElementById('productDescription').value = product.description || '';
    
    // Atualizar estado do formulário
    editProductId.value = product.id;
    productFormTitle.textContent = 'Editar Produto';
    saveProductBtn.textContent = 'Atualizar Produto';
    cancelEditBtn.classList.remove('hidden');
    
    // Rolar para o formulário
    addProductForm.scrollIntoView({ behavior: 'smooth' });
  }
}

// Remover produto
function deleteProduct(productId) {
  if (confirm('Tem certeza que deseja remover este produto?')) {
    removeProduct(productId);
    showToast('Produto removido', 'O produto foi removido com sucesso');
  }
}

// Carregar tabela de produtos
function loadProductsTable() {
  const products = getProducts();
  const tbody = productsTable.querySelector('tbody');
  
  // Limpar tabela existente
  tbody.innerHTML = '';
  
  if (products.length === 0) {
    // Mostrar mensagem de nenhum produto
    noProductsMessage.classList.remove('hidden');
    productsTable.classList.add('hidden');
  } else {
    // Mostrar tabela de produtos
    noProductsMessage.classList.add('hidden');
    productsTable.classList.remove('hidden');
    
    // Adicionar produtos à tabela
    products.forEach(product => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>
          <div class="cart-item-info">
            <img src="${product.imageUrl}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-name">${product.name}</div>
          </div>
        </td>
        <td>R$ ${formatCurrency(product.price)}</td>
        <td><span class="category-badge">${product.category}</span></td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" data-id="${product.id}">Editar</button>
            <button class="delete-btn" data-id="${product.id}">Remover</button>
          </div>
        </td>
      `;
      
      // Adicionar event listeners
      row.querySelector('.edit-btn').addEventListener('click', () => {
        editProduct(product.id);
      });
      
      row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteProduct(product.id);
      });
      
      tbody.appendChild(row);
    });
  }
}

/**
 * Gerenciamento de cupons
 */

// Lidar com envio do formulário de cupons
function handleCouponSubmit(e) {
  e.preventDefault();
  
  const couponData = {
    code: document.getElementById('couponCode').value.toUpperCase(),
    discount: parseInt(document.getElementById('couponDiscount').value),
    expiryDate: document.getElementById('couponExpiry').value,
    usageLimit: parseInt(document.getElementById('couponLimit').value),
    usageCount: 0
  };
  
  try {
    addCoupon(couponData);
    showToast('Cupom criado', 'Novo cupom criado com sucesso');
    addCouponForm.reset();
  } catch (error) {
    showToast('Erro', error.message, 'error');
  }
}

// Remover cupom
function deleteCoupon(couponCode) {
  if (confirm('Tem certeza que deseja desativar este cupom?')) {
    removeCoupon(couponCode);
    showToast('Cupom desativado', 'O cupom foi desativado com sucesso');
  }
}

// Carregar tabela de cupons
function loadCouponsTable() {
  const coupons = getCoupons();
  const tbody = couponsTable.querySelector('tbody');
  
  // Limpar tabela existente
  tbody.innerHTML = '';
  
  if (coupons.length === 0) {
    // Mostrar mensagem de nenhum cupom
    noCouponsMessage.classList.remove('hidden');
    couponsTable.classList.add('hidden');
  } else {
    // Mostrar tabela de cupons
    noCouponsMessage.classList.add('hidden');
    couponsTable.classList.remove('hidden');
    
    // Adicionar cupons à tabela
    coupons.forEach(coupon => {
      const row = document.createElement('tr');
      
      // Verificar se o cupom está expirado
      const isExpired = new Date(coupon.expiryDate) < new Date();
      
      // Verificar se o limite de uso foi atingido
      const isLimitReached = coupon.usageCount >= coupon.usageLimit;
      
      // Status do cupom
      let status = 'Ativo';
      if (isExpired) status = 'Expirado';
      if (isLimitReached) status = 'Limite atingido';
      
      row.innerHTML = `
        <td><strong>${coupon.code}</strong></td>
        <td>${coupon.discount}%</td>
        <td>${formatDate(coupon.expiryDate)}</td>
        <td>${coupon.usageCount}/${coupon.usageLimit} (${status})</td>
        <td>
          <div class="table-actions">
            <button class="delete-btn" data-code="${coupon.code}">Desativar</button>
          </div>
        </td>
      `;
      
      // Adicionar event listeners
      row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteCoupon(coupon.code);
      });
      
      tbody.appendChild(row);
    });
  }
}

/**
 * Gerenciamento de configurações
 */

// Lidar com envio do formulário de configurações
function handleSettingsSubmit(e) {
  e.preventDefault();
  
  const settingsData = {
    whatsappNumber: document.getElementById('whatsappNumber').value,
    welcomeMessage: document.getElementById('welcomeMessage').value,
    adminPassword: document.getElementById('adminPasswordChange').value
  };
  
  updateSettings(settingsData);
  showToast('Configurações salvas', 'As configurações foram atualizadas com sucesso');
  
  // Limpar campo de senha
  document.getElementById('adminPasswordChange').value = '';
}

// Carregar formulário de configurações
function loadSettingsForm() {
  const settings = getSettings();
  
  document.getElementById('whatsappNumber').value = settings.whatsappNumber;
  document.getElementById('welcomeMessage').value = settings.welcomeMessage;
  document.getElementById('adminPasswordChange').value = '';
}

/**
 * Gerenciamento de histórico
 */

// Carregar lista de histórico
function loadHistoryList() {
  const history = getHistory();
  
  // Limpar lista existente
  historyList.innerHTML = '';
  
  if (history.length === 0) {
    // Mostrar mensagem de nenhum registro
    noHistoryMessage.classList.remove('hidden');
  } else {
    // Mostrar lista de histórico
    noHistoryMessage.classList.add('hidden');
    
    // Adicionar itens ao histórico
    history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      // Definir ícone com base na ação
      let icon;
      switch (item.action) {
        case 'added':
          icon = 'add_circle';
          break;
        case 'modified':
          icon = 'edit';
          break;
        case 'removed':
          icon = 'remove_circle';
          break;
        default:
          icon = 'info';
      }
      
      historyItem.innerHTML = `
        <div class="history-date">${formatDateTime(item.timestamp)}</div>
        <div class="history-content">
          <span class="material-icons history-icon ${item.action}">${icon}</span>
          <div class="history-text">
            <div class="history-title">${item.itemName}</div>
            <div class="history-details">${item.details}</div>
          </div>
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });
  }
}