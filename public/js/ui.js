/**
 * Inicializa a interface do usuário
 */
function initializeUI() {
    // Elementos do DOM
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const filtersContainer = document.getElementById('filters');
    const productsGrid = document.getElementById('products-grid');
    const toastCloseBtn = document.querySelector('.toast-close');
    
    // Event listeners
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Configuração dos filtros
    setupFilters();
    
    // Fecha o menu ao clicar em um link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Botão de fechar toast
    toastCloseBtn.addEventListener('click', () => {
        document.getElementById('toast').style.display = 'none';
    });
    
    // Carrega os produtos
    loadProducts();
    
    // Atualiza o contador do carrinho
    updateCartBadge();
    
    // Ouve eventos de atualização do carrinho
    document.addEventListener('cartUpdated', updateCartBadge);
}

/**
 * Alterna o menu mobile
 */
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

/**
 * Atualiza o contador do carrinho
 */
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    cartBadge.textContent = getCartCount();
}

/**
 * Configura os filtros de produtos
 */
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Estado do filtro ativo
    let activeFilter = 'all';
    
    // Adiciona eventos de clique aos filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Remove a classe ativa de todos os botões
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Adiciona a classe ativa ao botão clicado
            btn.classList.add('active');
            
            // Atualiza o filtro ativo
            activeFilter = category;
            
            // Carrega os produtos com o filtro aplicado
            loadProducts(activeFilter);
        });
    });
}

/**
 * Carrega os produtos na grade
 * @param {string} category - Categoria para filtrar os produtos (opcional)
 */
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('products-grid');
    const products = getProducts();
    
    // Filtra os produtos por categoria, se necessário
    const filteredProducts = category === 'all'
        ? products
        : products.filter(product => product.category === category);
    
    // Limpa o grid
    productsGrid.innerHTML = '';
    
    // Se não houver produtos
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Nenhum produto encontrado nesta categoria</p>
            </div>
        `;
        return;
    }
    
    // Cria os cards de produtos
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

/**
 * Cria um card de produto
 * @param {Object} product - Objeto do produto
 * @returns {HTMLElement} - Elemento do card
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-img">
            <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <span class="product-category">${product.category}</span>
            <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    // Adiciona o evento de clique ao botão de adicionar ao carrinho
    const addButton = card.querySelector('.add-to-cart');
    addButton.addEventListener('click', () => {
        addToCart(product);
        showToast('Produto adicionado', `${product.name} foi adicionado ao carrinho!`);
    });
    
    return card;
}