/**
 * Função que é executada quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inicializa a conexão com o Firebase
        console.log('Iniciando conexão com Firebase...');
        
        // Configura o listener para produtos
        db.collection('products').onSnapshot((snapshot) => {
            const products = [];
            snapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });
            updateProductsUI(products);
        }, (error) => {
            console.error("Erro ao carregar produtos:", error);
        });

        // Inicializa a loja (produtos, configurações, etc.)
        initializeStore();
        
        // Inicializa a funcionalidade de carrinho
        initializeCart();
        
        // Inicializa o painel administrativo
        initializeAdmin();
        
        // Inicializa a interface do usuário
        initializeUI();
        
        console.log('Loja inicializada com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar a loja:', error);
    }
});

/**
 * Atualiza a interface com os produtos
 */
function updateProductsUI(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productElement = `
            <div class="product-card">
                <img src="${product.imagem}" alt="${product.nome}">
                <h3>${product.nome}</h3>
                <p>R$ ${product.preco?.toFixed(2) || '0.00'}</p>
                <button onclick="adicionarAoCarrinho('${product.id}')">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        productsGrid.innerHTML += productElement;
    });
}

// Função para inicializar a loja
function initializeStore() {
    // Carregar produtos iniciais
    loadProducts();
    
    // Configurar filtros de produtos
    setupFilters();
    
    // Configurar eventos da loja
    setupStoreEvents();
}

// Função para carregar produtos
function loadProducts() {
    // Os produtos agora são carregados pelo Firebase
    console.log('Produtos sendo carregados pelo Firebase...');
}

// Função para configurar filtros
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterProducts(category);
        });
    });
}

// Função para filtrar produtos
function filterProducts(category) {
    const query = category === 'all' 
        ? db.collection('products')
        : db.collection('products').where('categoria', '==', category);

    query.onSnapshot((snapshot) => {
        const products = [];
        snapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        updateProductsUI(products);
    });
}

// Função para configurar eventos da loja
function setupStoreEvents() {
    // Configurar evento de busca
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            searchProducts(searchTerm);
        });
    }
}

// Função para buscar produtos
function searchProducts(term) {
    db.collection('products').onSnapshot((snapshot) => {
        const products = [];
        snapshot.forEach((doc) => {
            const product = { id: doc.id, ...doc.data() };
            if (product.nome.toLowerCase().includes(term)) {
                products.push(product);
            }
        });
        updateProductsUI(products);
    });
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(productId) {
    db.collection('products').doc(productId).get()
        .then((doc) => {
            if (doc.exists) {
                const product = { id: doc.id, ...doc.data() };
                // Aqui você pode implementar a lógica do carrinho
                console.log('Produto adicionado ao carrinho:', product);
                alert('Produto adicionado ao carrinho!');
            }
        })
        .catch((error) => {
            console.error('Erro ao adicionar ao carrinho:', error);
        });
}

// Função para inicializar o carrinho
function initializeCart() {
    // Implementar inicialização do carrinho
    console.log('Carrinho inicializado');
}

// Função para inicializar o painel administrativo
function initializeAdmin() {
    // Implementar inicialização do painel admin
    console.log('Painel administrativo inicializado');
}

// Função para inicializar a interface do usuário
function initializeUI() {
    // Implementar inicialização da UI
    console.log('Interface do usuário inicializada');
}