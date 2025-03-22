/**
 * Função que é executada quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica se o adaptador de banco de dados está disponível
    if (window.dbAdapter) {
        console.log('Usando banco de dados remoto para sincronização');
        
        // Verifica se é a primeira vez que o usuário está acessando com o BD
        checkForDataMigration();
    } else {
        console.log('Usando armazenamento local (modo offline)');
    }

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

/**
 * Verifica se é necessário migrar dados do localStorage para o banco de dados
 */
function checkForDataMigration() {
    // Verificar se já realizou a migração antes
    const migrationDone = localStorage.getItem('db_migration_completed');
    
    // Se já migrou, não faz nada
    if (migrationDone === 'true') {
        return;
    }
    
    // Verificar se há dados no localStorage que precisam ser migrados
    const hasLocalData = 
        localStorage.getItem('products') || 
        localStorage.getItem('coupons') || 
        localStorage.getItem('news') || 
        localStorage.getItem('settings');
        
    if (hasLocalData) {
        // Mostrar modal de confirmação
        setTimeout(() => {
            showMigrationDialog();
        }, 1000);
    } else {
        // Marcar migração como concluída se não há dados para migrar
        localStorage.setItem('db_migration_completed', 'true');
    }
}

/**
 * Mostra o diálogo para migração de dados
 */
function showMigrationDialog() {
    // Criar o modal
    const modalHTML = `
        <div class="toast-container" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
            <div class="toast" role="alert" style="width: 350px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); overflow: hidden; margin-bottom: 10px;">
                <div class="toast-header" style="padding: 12px 15px; background: #4b70e2; color: white; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                    <span>Sincronização de Dados</span>
                    <button type="button" class="btn-close" aria-label="Fechar" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
                </div>
                <div class="toast-body" style="padding: 15px;">
                    <p>Detectamos dados locais em seu navegador. Deseja migrar estes dados para o banco de dados para sincronização entre dispositivos?</p>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="migrate-btn" style="flex: 1; padding: 8px; background: #4b70e2; color: white; border: none; border-radius: 4px; cursor: pointer;">Migrar Dados</button>
                        <button class="skip-btn" style="flex: 1; padding: 8px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer;">Agora Não</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar o modal ao corpo da página
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Adicionar eventos
    const closeBtn = modalContainer.querySelector('.btn-close');
    const migrateBtn = modalContainer.querySelector('.migrate-btn');
    const skipBtn = modalContainer.querySelector('.skip-btn');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    skipBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    migrateBtn.addEventListener('click', async () => {
        try {
            // Mostrar indicador de carregamento
            const toastBody = modalContainer.querySelector('.toast-body');
            toastBody.innerHTML = '<p>Migrando dados, por favor aguarde...</p><div class="progress" style="height: 20px; margin-top: 15px;"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%; height: 100%; background-color: #4b70e2;"></div></div>';
            
            // Obter dados do localStorage
            const sources = [];
            if (localStorage.getItem('products')) sources.push('products');
            if (localStorage.getItem('coupons')) sources.push('coupons');
            if (localStorage.getItem('news')) sources.push('news');
            if (localStorage.getItem('settings')) sources.push('settings');
            
            // Chamar a API de migração
            await window.dbAdapter.migrateData(sources, {
                keepLocal: true,  // manter dados locais como backup
                overwriteExisting: false // não sobrescrever dados já existentes no banco
            });
            
            // Atualizar UI após migração
            toastBody.innerHTML = '<p>Dados migrados com sucesso!</p><div style="display: flex; justify-content: center; margin-top: 15px;"><button class="close-btn" style="padding: 8px 20px; background: #4b70e2; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button></div>';
            
            // Marcar migração como concluída
            localStorage.setItem('db_migration_completed', 'true');
            
            // Adicionar evento ao botão de fechar
            const closeButton = modalContainer.querySelector('.close-btn');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modalContainer);
                // Recarregar a página para usar os dados migrados
                window.location.reload();
            });
            
        } catch (error) {
            console.error('Erro na migração:', error);
            const toastBody = modalContainer.querySelector('.toast-body');
            toastBody.innerHTML = `<p>Erro na migração: ${error.message}</p><div style="display: flex; justify-content: center; margin-top: 15px;"><button class="close-btn" style="padding: 8px 20px; background: #4b70e2; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button></div>`;
            
            // Adicionar evento ao botão de fechar
            const closeButton = modalContainer.querySelector('.close-btn');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });
        }
    });
}