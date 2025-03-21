/**
 * Script principal - inicializa a aplicação
 */

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar a loja
  initializeStore();
  
  // Inicializar a interface do usuário
  initializeUI();
  
  // Inicializar o carrinho
  initializeCart();
  
  // Inicializar a área administrativa
  initializeAdmin();
  
  // Exibir mensagem de boas-vindas
  setTimeout(() => {
    showToast('Bem-vindo', 'Bem-vindo à Fashion Store!');
  }, 1000);
});