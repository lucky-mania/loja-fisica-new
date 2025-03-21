/**
 * Gerenciamento da interface do usuário
 */

// Elementos da UI
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const cartBadge = document.getElementById('cartBadge');
const productsList = document.querySelector('.products-grid');
const filterContainer = document.querySelector('.filters');

// Estado da interface
let activeFilter = 'Todos';

// Inicialização da UI
function initializeUI() {
  // Atualizar contagem do carrinho
  updateCartBadge();
  
  // Carregar filtros
  loadFilters();
  
  // Carregar produtos
  loadProducts();
  
  // Adicionar event listeners
  setupEventListeners();
  
  // Ouvir eventos customizados
  window.addEventListener('productsUpdated', loadProducts);
  window.addEventListener('cartUpdated', updateCartBadge);
}

// Configurar event listeners
function setupEventListeners() {
  // Menu móvel
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  // Navegação suave para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Se o menu móvel estiver aberto, fechá-lo
        if (mobileMenu.classList.contains('active')) {
          toggleMobileMenu();
        }
      }
    });
  });
}

// Alternar menu móvel
function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
  
  // Alterar ícone do botão
  const icon = mobileMenuBtn.querySelector('.material-icons');
  icon.textContent = mobileMenu.classList.contains('active') ? 'close' : 'menu';
}

// Atualizar badge do carrinho
function updateCartBadge() {
  const count = getCartCount();
  
  if (count > 0) {
    cartBadge.textContent = count;
    cartBadge.classList.remove('hidden');
  } else {
    cartBadge.classList.add('hidden');
  }
}

// Carregar filtros
function loadFilters() {
  const categories = ["Todos", "Camisetas", "Calças", "Vestidos", "Acessórios"];
  
  // Limpar filtros existentes
  filterContainer.innerHTML = '';
  
  // Adicionar botões de filtro
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `filter-btn ${activeFilter === category ? 'active' : ''}`;
    button.textContent = category;
    
    button.addEventListener('click', () => {
      setActiveFilter(category);
    });
    
    filterContainer.appendChild(button);
  });
}

// Definir filtro ativo
function setActiveFilter(category) {
  activeFilter = category;
  
  // Atualizar classes de botões
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === category);
  });
  
  // Recarregar produtos com o filtro
  loadProducts();
}

// Carregar produtos
function loadProducts() {
  const products = getProducts();
  
  // Aplicar filtro
  const filteredProducts = activeFilter === 'Todos' 
    ? products 
    : products.filter(product => product.category === activeFilter);
  
  // Limpar produtos existentes
  productsList.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    // Exibir mensagem de nenhum produto encontrado
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-products';
    emptyMessage.innerHTML = `
      <div class="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-12 mt-6">
        <span class="material-icons text-5xl text-gray-300 mb-2">inventory_2</span>
        <p class="text-gray-500 text-center">Nenhum produto encontrado nesta categoria.</p>
        ${activeFilter !== "Todos" ? `
          <button class="continue-shopping mt-4">
            Ver todos os produtos
          </button>
        ` : ''}
      </div>
    `;
    
    // Adicionar event listener para o botão de ver todos
    if (activeFilter !== "Todos") {
      emptyMessage.querySelector('.continue-shopping').addEventListener('click', () => {
        setActiveFilter("Todos");
      });
    }
    
    productsList.appendChild(emptyMessage);
  } else {
    // Adicionar produtos filtrados
    filteredProducts.forEach(product => {
      const productCard = createProductCard(product);
      productsList.appendChild(productCard);
    });
  }
}

// Criar card de produto
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price-actions">
        <p class="product-price">R$ ${formatCurrency(product.price)}</p>
        <button class="add-to-cart-btn">
          <span class="material-icons">add_shopping_cart</span>
        </button>
      </div>
    </div>
  `;
  
  // Adicionar event listener para o botão de adicionar ao carrinho
  card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    addToCart(product);
    showToast('Produto adicionado', `${product.name} foi adicionado ao carrinho!`);
  });
  
  return card;
}