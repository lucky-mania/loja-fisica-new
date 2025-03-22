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

// Remove as funções de migração que não são mais necessárias