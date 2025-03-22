import { listenToProducts } from './database-service.js';

// Função para atualizar a interface
function updateProductsUI(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productElement = `
            <div class="product-card">
                <img src="${product.imagem}" alt="${product.nome}">
                <h3>${product.nome}</h3>
                <p>R$ ${product.preco.toFixed(2)}</p>
                <button onclick="adicionarAoCarrinho('${product.id}')">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        productsGrid.innerHTML += productElement;
    });
}

// Único evento DOMContentLoaded com todas as inicializações
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o listener de produtos do Firebase
    listenToProducts(updateProductsUI);
    
    // Inicializa a loja (produtos, configurações, etc.)
    initializeStore();
    
    // Inicializa a funcionalidade de carrinho
    initializeCart();
    
    // Inicializa o painel administrativo
    initializeAdmin();
    
    // Inicializa a interface do usuário
    initializeUI();
    
    console.log('Loja inicializada com sucesso!');
});