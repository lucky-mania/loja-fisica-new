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
    const cartIcon = document.getElementById('cart-icon');
    
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
    
    // Configura o carrinho inicialmente invisível
    if (cartIcon) {
        const cartCount = getCartCount();
        if (cartCount === 0) {
            cartIcon.style.opacity = '0.5';
        } else {
            cartIcon.style.opacity = '1';
        }
    }
    
    // Carrega os produtos
    loadProducts();
    
    // Carrega a seção de novidades
    loadNewsSection();
    
    // Atualiza o contador do carrinho
    updateCartBadge();
    
    // Ouve eventos de atualização do carrinho
    document.addEventListener('cartUpdated', () => {
        updateCartBadge();
        showCartIfNotEmpty();
    });
    
    // Mostra o carrinho quando não está vazio
    showCartIfNotEmpty();
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
    
    // Prepara a exibição dos tamanhos disponíveis (se houver)
    let sizesHtml = '';
    if (product.availableSizes && product.availableSizes.length > 0) {
        sizesHtml = `
            <div class="product-sizes">
                <span>Tamanhos: </span>
                ${product.availableSizes.map(size => `<span class="size-tag">${size}</span>`).join(' ')}
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="product-img">
            <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <span class="product-category">${product.category}</span>
            ${sizesHtml}
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

/**
 * Mostra o ícone do carrinho apenas quando não estiver vazio
 */
function showCartIfNotEmpty() {
    const cartIcon = document.getElementById('cart-icon');
    if (!cartIcon) return;
    
    const cartCount = getCartCount();
    
    // Tornar o carrinho mais ou menos visível com base no conteúdo
    if (cartCount === 0) {
        cartIcon.style.opacity = '0.5';
        cartIcon.style.transform = 'scale(0.9)';
    } else {
        cartIcon.style.opacity = '1';
        cartIcon.style.transform = 'scale(1)';
        
        // Adiciona uma animação sutil quando há produtos
        cartIcon.classList.add('cart-has-items');
    }
}

/**
 * Carrega a seção de novidades na página
 */
function loadNewsSection() {
    const newsSection = document.getElementById('news');
    if (!newsSection) return;
    
    const newsCarousel = document.getElementById('news-carousel');
    if (!newsCarousel) return;
    
    const news = getNews();
    
    // Limpa o container
    newsCarousel.innerHTML = '';
    
    // Se não houver novidades, exibe mensagem
    if (news.length === 0) {
        newsCarousel.innerHTML = '<div class="news-empty">Em breve, novas coleções e produtos!</div>';
        return;
    }
    
    // Ordenar novidades por data (mais recentes primeiro)
    const sortedNews = [...news].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Limita a 3 itens para exibição na página inicial
    const recentNews = sortedNews.slice(0, 3);
    
    // Cria os cards de novidades
    recentNews.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        newsCard.innerHTML = `
            <div class="news-img">
                <img src="${item.imageUrl}" alt="${item.title}">
            </div>
            <div class="news-info">
                <h3 class="news-title">${item.title}</h3>
                <div class="news-date">${formatDate(item.date)}</div>
                <p class="news-description">${item.description}</p>
            </div>
        `;
        
        newsCarousel.appendChild(newsCard);
    });
}