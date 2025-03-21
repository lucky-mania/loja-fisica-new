/**
 * Função que é executada quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
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