/*adm*/
/**
 * Inicializa o painel administrativo
 */
function initializeAdmin() {
    // Elementos do DOM
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeAdminLoginBtn = document.getElementById('close-admin-login-btn');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminPanelModal = document.getElementById('admin-panel-modal');
    const closeAdminPanelBtn = document.getElementById('close-admin-panel-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Gallery Modal Elements
    const galleryModal = document.getElementById('gallery-modal');
    const galleryBtn = document.getElementById('gallery-btn');
    const newsGalleryBtn = document.getElementById('news-gallery-btn');
    const closeGalleryBtn = document.getElementById('close-gallery-modal');
    const selectImageBtn = document.getElementById('select-image-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Variáveis para controle da galeria
    let currentInput = null;
    let currentPreview = null;
    let selectedGalleryItem = null;
    
    // Events
    adminLoginBtn.addEventListener('click', openAdminLogin);
    closeAdminLoginBtn.addEventListener('click', closeAdminLogin);
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    closeAdminPanelBtn.addEventListener('click', () => {
        adminPanelModal.style.display = 'none';
    });
    adminLogoutBtn.addEventListener('click', handleLogout);
    
    // Tab navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            setActiveAdminTab(tabName);
        });
    });
    
    // Fechamento de modais ao clicar fora
    adminLoginModal.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            closeAdminLogin();
        }
    });
    
    adminPanelModal.addEventListener('click', (e) => {
        if (e.target === adminPanelModal) {
            adminPanelModal.style.display = 'none';
        }
    });
    
    // Fechamento da galeria ao clicar fora
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.style.display = 'none';
            }
        });
    }
    
    // Formulários
    const productForm = document.getElementById('product-form');
    const couponForm = document.getElementById('coupon-form');
    const newsForm = document.getElementById('news-form');
    const settingsForm = document.getElementById('settings-form');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    const cancelNewsBtn = document.getElementById('cancel-news-btn');
    
    productForm.addEventListener('submit', handleProductSubmit);
    couponForm.addEventListener('submit', handleCouponSubmit);
    settingsForm.addEventListener('submit', handleSettingsSubmit);
    cancelProductBtn.addEventListener('click', cancelProductEdit);
    
    // Formulário de novidades
    if (newsForm) {
        newsForm.addEventListener('submit', handleNewsSubmit);
    }
    
    if (cancelNewsBtn) {
        cancelNewsBtn.addEventListener('click', cancelNewsEdit);
    }
    
    // Gallery Events
    if (galleryBtn) {
        galleryBtn.addEventListener('click', () => {
            openGallery('product-image', 'image-preview');
        });
    }
    
    if (newsGalleryBtn) {
        newsGalleryBtn.addEventListener('click', () => {
            openGallery('news-image', 'news-image-preview');
        });
    }
    
    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.style.display = 'none';
        });
    }
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove selected class from all items
                galleryItems.forEach(i => i.style.border = '2px solid transparent');
                
                // Add selected class to clicked item
                item.style.border = '2px solid var(--primary-color)';
                selectedGalleryItem = item;
            });
        });
    }
    
    if (selectImageBtn) {
        selectImageBtn.addEventListener('click', () => {
            if (selectedGalleryItem && currentInput) {
                const imageUrl = selectedGalleryItem.getAttribute('data-url');
                currentInput.value = imageUrl;
                
                // Show preview
                if (currentPreview) {
                    currentPreview.innerHTML = `<img src="${imageUrl}" alt="Preview">`;
                    currentPreview.style.display = 'block';
                }
                
                // Reset and close
                selectedGalleryItem = null;
                galleryModal.style.display = 'none';
            }
        });
    }
    
    // Size options initialization for products
    initializeSizeOptions();
    
    // Initialize news table
    loadNewsTable();
    
    // Verifica se há uma sessão de admin ativa
    checkAdminSession();
}

/**
 * Verifica se há uma sessão de administrador ativa
 */
function checkAdminSession() {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    if (isAdmin) {
        document.getElementById('admin-login-btn').innerHTML = '<i class="fas fa-user-cog"></i> Admin';
    } else {
        document.getElementById('admin-login-btn').innerHTML = 'Admin';
    }
}

/**
 * Abre o modal de login de administrador
 */
function openAdminLogin() {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    if (isAdmin) {
        // Se já está logado, abre direto o painel admin
        document.getElementById('admin-panel-modal').style.display = 'block';
        loadAdminData();
    } else {
        document.getElementById('admin-login-modal').style.display = 'block';
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

/**
 * Fecha o modal de login de administrador
 */
function closeAdminLogin() {
    document.getElementById('admin-login-modal').style.display = 'none';
}

/**
 * Manipula o login de administrador
 */
function handleAdminLogin(e) {
    e.preventDefault();
    
    const passwordInput = document.getElementById('admin-password');
    const password = passwordInput.value.trim();
    
    if (verifyAdminPassword(password)) {
        // Define a sessão de admin
        sessionStorage.setItem('isAdmin', 'true');
        
        // Atualiza o botão de admin
        checkAdminSession();
        
        // Fecha modal de login e abre painel admin
        closeAdminLogin();
        document.getElementById('admin-panel-modal').style.display = 'block';
        
        // Carrega dados do admin
        loadAdminData();
        
        // Limpa a senha
        passwordInput.value = '';
        
        showToast('Login realizado', 'Bem-vindo ao painel administrativo!');
    } else {
        showToast('Erro', 'Senha incorreta.', 'error');
    }
}

/**
 * Manipula o logout de administrador
 */
function handleLogout() {
    sessionStorage.removeItem('isAdmin');
    document.getElementById('admin-panel-modal').style.display = 'none';
    checkAdminSession();
    showToast('Logout realizado', 'Sessão de administrador encerrada.');
}

/**
 * Carrega os dados para o painel administrativo
 */
function loadAdminData() {
    // Define a tab ativa como "produtos" por padrão
    setActiveAdminTab('products');
    
    // Carrega os produtos
    loadProductsTable();
    
    // Carrega os cupons
    loadCouponsTable();
    
    // Carrega configurações
    loadSettingsForm();
    
    // Carrega histórico
    loadHistoryList();
}

/**
 * Define a tab ativa no painel administrativo
 */
function setActiveAdminTab(tabName) {
    // Remove a classe ativa de todas as tabs e conteúdos
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Adiciona a classe ativa à tab e conteúdo selecionados
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

/**
 * Manipula o envio do formulário de produto
 */
function handleProductSubmit(e) {
    e.preventDefault();
    
    // Obtém os valores do formulário
    const productId = document.getElementById('product-id').value;
    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productCategory = document.getElementById('product-category').value;
    const productImage = document.getElementById('product-image').value;
    const productDescription = document.getElementById('product-description').value;
    
    // Captura os tamanhos selecionados
    const sizeCheckboxes = document.querySelectorAll('.size-checkbox:checked');
    const selectedSizes = Array.from(sizeCheckboxes).map(checkbox => checkbox.value);
    
    // Define os tamanhos disponíveis com base na categoria selecionada
    let allSizes = [];
    if (productCategory === 'camisetas') {
        allSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
    } else if (productCategory === 'calcas') {
        allSizes = ['36', '38', '40', '42', '44', '46', '48', '50'];
    } else if (productCategory === 'acessorios') {
        allSizes = ['Único'];
    }
    
    const productData = {
        name: productName,
        price: productPrice,
        category: productCategory,
        imageUrl: productImage,
        description: productDescription,
        sizes: allSizes,
        availableSizes: selectedSizes.length > 0 ? selectedSizes : allSizes // Se nenhum tamanho for selecionado, usa todos
    };
    
    // Verifica se é uma edição ou adição
    if (productId) {
        // Edição
        const product = {
            id: productId,
            ...productData
        };
        
        if (updateProduct(product)) {
            showToast('Produto atualizado', `O produto "${productName}" foi atualizado com sucesso.`);
            resetProductForm();
            loadProductsTable();
        } else {
            showToast('Erro', 'Não foi possível atualizar o produto.', 'error');
        }
    } else {
        // Adição
        const newProduct = addProduct(productData);
        showToast('Produto adicionado', `O produto "${productName}" foi adicionado com sucesso.`);
        resetProductForm();
        loadProductsTable();
    }
}

/**
 * Cancela a edição de um produto
 */
function cancelProductEdit() {
    resetProductForm();
    showToast('Edição cancelada', 'A edição do produto foi cancelada.');
}

/**
 * Reseta o formulário de produto
 */
function resetProductForm() {
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-category').value = 'camisetas';
    document.getElementById('product-image').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('cancel-product-btn').style.display = 'none';
}

/**
 * Carrega um produto para edição
 */
function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image').value = product.imageUrl;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('cancel-product-btn').style.display = 'inline-block';
        
        // Atualiza os tamanhos disponíveis para a categoria selecionada
        initializeSizeOptions();
        
        // Marca os checkboxes dos tamanhos disponíveis
        setTimeout(() => {
            if (product.availableSizes && product.availableSizes.length > 0) {
                product.availableSizes.forEach(size => {
                    const checkbox = document.getElementById(`size-${size}`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        }, 100); // Pequeno timeout para garantir que os checkboxes foram criados
        
        // Exibe a imagem do produto no preview
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview && product.imageUrl) {
            imagePreview.innerHTML = `<img src="${product.imageUrl}" alt="Preview">`;
            imagePreview.style.display = 'block';
        }
        
        // Rola a página para o formulário
        document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
        
        // Foca no primeiro campo
        document.getElementById('product-name').focus();
    }
}

/**
 * Remove um produto
 */
function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        if (removeProduct(productId)) {
            showToast('Produto removido', 'O produto foi removido com sucesso.');
            loadProductsTable();
        } else {
            showToast('Erro', 'Não foi possível remover o produto.', 'error');
        }
    }
}

/**
 * Carrega a tabela de produtos
 */
function loadProductsTable() {
    const productsTableBody = document.querySelector('#products-table tbody');
    const products = getProducts();
    
    productsTableBody.innerHTML = '';
    
    if (products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">Nenhum produto cadastrado</td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.category}</td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        productsTableBody.appendChild(row);
    });
    
    // Adiciona event listeners para edição e remoção
    const editBtns = productsTableBody.querySelectorAll('.edit-btn');
    const deleteBtns = productsTableBody.querySelectorAll('.delete-btn');
    
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

/**
 * Manipula o envio do formulário de cupom
 */
function handleCouponSubmit(e) {
    e.preventDefault();
    
    // Obtém os valores do formulário
    const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
    const couponDiscount = parseInt(document.getElementById('coupon-discount').value);
    const couponExpiry = document.getElementById('coupon-expiry').value;
    const couponLimit = parseInt(document.getElementById('coupon-limit').value);
    
    const couponData = {
        code: couponCode,
        discount: couponDiscount,
        expiryDate: new Date(couponExpiry).toISOString(),
        usageLimit: couponLimit,
    };
    
    const result = addCoupon(couponData);
    
    if (result.success) {
        showToast('Cupom adicionado', `O cupom "${couponCode}" foi adicionado com sucesso.`);
        
        // Limpa o formulário
        document.getElementById('coupon-code').value = '';
        document.getElementById('coupon-discount').value = '';
        document.getElementById('coupon-expiry').value = '';
        document.getElementById('coupon-limit').value = '';
        
        // Atualiza a tabela de cupons
        loadCouponsTable();
    } else {
        showToast('Erro', result.message, 'error');
    }
}

/**
 * Remove um cupom
 */
function deleteCoupon(couponCode) {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
        if (removeCoupon(couponCode)) {
            showToast('Cupom removido', 'O cupom foi removido com sucesso.');
            loadCouponsTable();
        } else {
            showToast('Erro', 'Não foi possível remover o cupom.', 'error');
        }
    }
}

/**
 * Carrega a tabela de cupons
 */
function loadCouponsTable() {
    const couponsTableBody = document.querySelector('#coupons-table tbody');
    const coupons = getCoupons();
    
    couponsTableBody.innerHTML = '';
    
    if (coupons.length === 0) {
        couponsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">Nenhum cupom cadastrado</td>
            </tr>
        `;
        return;
    }
    
    coupons.forEach(coupon => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${coupon.code}</td>
            <td>${coupon.discount}%</td>
            <td>${formatDate(coupon.expiryDate)}</td>
            <td>${coupon.usageCount}/${coupon.usageLimit}</td>
            <td>
                <div class="table-actions">
                    <button class="delete-btn" data-code="${coupon.code}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        couponsTableBody.appendChild(row);
    });
    
    // Adiciona event listeners para remoção
    const deleteBtns = couponsTableBody.querySelectorAll('.delete-btn');
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const couponCode = btn.getAttribute('data-code');
            deleteCoupon(couponCode);
        });
    });
}

/**
 * Manipula o envio do formulário de configurações
 */
function handleSettingsSubmit(e) {
    e.preventDefault();
    
    // Obtém os valores do formulário
    const whatsappNumber = document.getElementById('whatsapp-number').value.trim();
    const welcomeMessage = document.getElementById('welcome-message').value.trim();
    const newPassword = document.getElementById('admin-password-change').value.trim();
    
    // Obtém as configurações atuais
    const currentSettings = getSettings();
    
    // Atualiza as configurações
    const settings = {
        whatsappNumber,
        welcomeMessage,
        adminPassword: newPassword || currentSettings.adminPassword // Mantém a senha atual se não for fornecida uma nova
    };
    
    updateSettings(settings);
    
    // Limpa o campo de senha
    document.getElementById('admin-password-change').value = '';
    
    showToast('Configurações salvas', 'As configurações foram atualizadas com sucesso.');
}

/**
 * Carrega o formulário de configurações
 */
function loadSettingsForm() {
    const settings = getSettings();
    
    document.getElementById('whatsapp-number').value = settings.whatsappNumber;
    document.getElementById('welcome-message').value = settings.welcomeMessage;
    document.getElementById('admin-password-change').value = '';
}

/**
 * Inicializa as opções de tamanho para produtos
 */
function initializeSizeOptions() {
    const sizeOptionsContainer = document.getElementById('size-options');
    const productCategory = document.getElementById('product-category');
    
    if (!sizeOptionsContainer || !productCategory) return;
    
    // Defina os tamanhos disponíveis com base na categoria
    const updateSizeOptions = () => {
        const category = productCategory.value;
        sizeOptionsContainer.innerHTML = '';
        
        let sizes = [];
        
        if (category === 'camisetas') {
            sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
        } else if (category === 'calcas') {
            sizes = ['36', '38', '40', '42', '44', '46', '48', '50'];
        } else if (category === 'acessorios') {
            sizes = ['Único'];
        }
        
        // Cria checkboxes para cada tamanho
        sizes.forEach(size => {
            const id = `size-${size}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.className = 'size-checkbox';
            checkbox.value = size;
            checkbox.name = 'sizes';
            
            const label = document.createElement('label');
            label.htmlFor = id;
            label.className = 'size-label';
            label.textContent = size;
            
            sizeOptionsContainer.appendChild(checkbox);
            sizeOptionsContainer.appendChild(label);
        });
    };
    
    // Atualiza as opções quando a categoria muda
    productCategory.addEventListener('change', updateSizeOptions);
    
    // Inicializa as opções
    updateSizeOptions();
}

/**
 * Abre a galeria de imagens
 */
function openGallery(inputId, previewId) {
    const galleryModal = document.getElementById('gallery-modal');
    currentInput = document.getElementById(inputId);
    currentPreview = document.getElementById(previewId);
    selectedGalleryItem = null;
    
    // Reset selected class
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.style.border = '2px solid transparent';
        
        // If this item matches current input value, select it
        if (currentInput && item.getAttribute('data-url') === currentInput.value) {
            item.style.border = '2px solid var(--primary-color)';
            selectedGalleryItem = item;
        }
    });
    
    galleryModal.style.display = 'block';
}

/**
 * Manipula o envio do formulário de novidades
 */
function handleNewsSubmit(e) {
    e.preventDefault();
    
    // Obtém os valores do formulário
    const newsId = document.getElementById('news-id').value;
    const newsTitle = document.getElementById('news-title').value;
    const newsDescription = document.getElementById('news-description').value;
    const newsImage = document.getElementById('news-image').value;
    const newsDate = document.getElementById('news-date').value;
    
    const newsData = {
        title: newsTitle,
        description: newsDescription,
        imageUrl: newsImage,
        date: new Date(newsDate).toISOString()
    };
    
    // Verifica se é uma edição ou adição
    if (newsId) {
        // Edição
        const newsItem = {
            id: newsId,
            ...newsData
        };
        
        if (updateNews(newsItem)) {
            showToast('Novidade atualizada', `A novidade "${newsTitle}" foi atualizada com sucesso.`);
            resetNewsForm();
            loadNewsTable();
        } else {
            showToast('Erro', 'Não foi possível atualizar a novidade.', 'error');
        }
    } else {
        // Adição
        const newNews = addNews(newsData);
        showToast('Novidade adicionada', `A novidade "${newsTitle}" foi adicionada com sucesso.`);
        resetNewsForm();
        loadNewsTable();
        
        // Atualiza a seção de novidades na página principal
        loadNewsSection();
    }
}

/**
 * Cancela a edição de uma novidade
 */
function cancelNewsEdit() {
    resetNewsForm();
    showToast('Edição cancelada', 'A edição da novidade foi cancelada.');
}

/**
 * Reseta o formulário de novidade
 */
function resetNewsForm() {
    document.getElementById('news-id').value = '';
    document.getElementById('news-title').value = '';
    document.getElementById('news-description').value = '';
    document.getElementById('news-image').value = '';
    document.getElementById('news-date').value = '';
    
    // Reset image preview
    const imagePreview = document.getElementById('news-image-preview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
    }
    
    // Hide cancel button
    const cancelBtn = document.getElementById('cancel-news-btn');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

/**
 * Carrega a tabela de novidades
 */
function loadNewsTable() {
    const newsTableBody = document.querySelector('#news-table tbody');
    if (!newsTableBody) return;
    
    const news = getNews();
    
    newsTableBody.innerHTML = '';
    
    if (news.length === 0) {
        newsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-table">Nenhuma novidade cadastrada</td>
            </tr>
        `;
        return;
    }
    
    news.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${formatDate(item.date)}</td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        newsTableBody.appendChild(row);
    });
    
    // Adiciona event listeners para edição e remoção
    const editBtns = newsTableBody.querySelectorAll('.edit-btn');
    const deleteBtns = newsTableBody.querySelectorAll('.delete-btn');
    
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newsId = btn.getAttribute('data-id');
            editNews(newsId);
        });
    });
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newsId = btn.getAttribute('data-id');
            deleteNews(newsId);
        });
    });
}

/**
 * Carrega uma novidade para edição
 */
function editNews(newsId) {
    const news = getNews();
    const newsItem = news.find(n => n.id === newsId);
    
    if (newsItem) {
        document.getElementById('news-id').value = newsItem.id;
        document.getElementById('news-title').value = newsItem.title;
        document.getElementById('news-description').value = newsItem.description;
        document.getElementById('news-image').value = newsItem.imageUrl;
        
        // Format date for input (YYYY-MM-DD)
        const date = new Date(newsItem.date);
        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById('news-date').value = formattedDate;
        
        // Show preview
        const imagePreview = document.getElementById('news-image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = `<img src="${newsItem.imageUrl}" alt="Preview">`;
            imagePreview.style.display = 'block';
        }
        
        // Show cancel button
        const cancelBtn = document.getElementById('cancel-news-btn');
        if (cancelBtn) {
            cancelBtn.style.display = 'inline-block';
        }
        
        // Set active tab
        setActiveAdminTab('news');
        
        // Scroll to form
        document.getElementById('news-form').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Remove uma novidade
 */
function deleteNews(newsId) {
    if (confirm('Tem certeza que deseja excluir esta novidade?')) {
        if (removeNews(newsId)) {
            showToast('Novidade removida', 'A novidade foi removida com sucesso.');
            loadNewsTable();
            loadNewsSection();
        } else {
            showToast('Erro', 'Não foi possível remover a novidade.', 'error');
        }
    }
}

/**
 * Carrega a lista de histórico
 */
function loadHistoryList() {
    const historyList = document.getElementById('history-list');
    const historyContainer = document.getElementById('history-container');
    const history = getHistory();
    
    // Limpa o conteúdo atual
    historyList.innerHTML = '';
    
    // Adiciona botão para limpar histórico se não existir já
    if (!document.getElementById('clear-history-btn')) {
        const clearButton = document.createElement('button');
        clearButton.id = 'clear-history-btn';
        clearButton.className = 'btn btn-danger';
        clearButton.innerHTML = '<i class="fas fa-trash"></i> Limpar Histórico';
        clearButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                clearHistory();
                loadHistoryList();
                showToast('Histórico limpo', 'O histórico de atividades foi limpo com sucesso.');
            }
        });
        
        // Adiciona informação sobre limpeza automática
        const infoText = document.createElement('p');
        infoText.className = 'history-info';
        infoText.innerHTML = '<i class="fas fa-info-circle"></i> Registros com mais de 24 horas são limpos automaticamente.';
        
        // Adiciona elementos ao container
        const headerDiv = document.createElement('div');
        headerDiv.className = 'history-header';
        headerDiv.appendChild(clearButton);
        
        if (historyContainer) {
            historyContainer.insertBefore(headerDiv, historyList);
            historyContainer.insertBefore(infoText, historyList);
        }
    }
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>Nenhuma atividade registrada</p>
            </div>
        `;
        return;
    }
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        let actionIcon;
        if (item.action === 'added') {
            actionIcon = 'fa-plus-circle';
        } else if (item.action === 'modified') {
            actionIcon = 'fa-edit';
        } else {
            actionIcon = 'fa-minus-circle';
        }
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-item-title">
                    <i class="fas ${actionIcon}"></i> ${item.itemName}
                </span>
                <span class="history-item-time">${formatDateTime(item.timestamp)}</span>
            </div>
            <div class="history-item-details">${item.details}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}






/*cart*/
/**
 * Inicializa o carrinho e seus eventos
 */
function initializeCart() {
    // Elementos do DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscount = document.getElementById('cart-discount');
    const cartTotal = document.getElementById('cart-total');
    const discountContainer = document.getElementById('discount-container');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-input');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Event listeners
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    applyCouponBtn.addEventListener('click', handleApplyCoupon);
    clearCartBtn.addEventListener('click', () => {
        clearCart();
        loadCartItems();
        showToast('Carrinho limpo', 'Todos os produtos foram removidos do carrinho.');
    });
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Fecha o modal ao clicar fora dele
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCart();
        }
    });
    
    // Atualiza o contador do carrinho quando ele for modificado
    document.addEventListener('cartUpdated', () => {
        const cartBadge = document.getElementById('cart-badge');
        cartBadge.textContent = getCartCount();
    });
    
    // Inicializa o contador do carrinho
    document.dispatchEvent(new Event('cartUpdated'));
}

/**
 * Abre o modal do carrinho
 */
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    loadCartItems();
}

/**
 * Fecha o modal do carrinho
 */
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
    
    // Limpa o campo de cupom ao fechar
    document.getElementById('coupon-input').value = '';
}

/**
 * Carrega os itens do carrinho no modal
 */
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = getCart();
    
    // Limpa o conteúdo atual
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        
        // Atualiza os totais
        updateCartTotals(0, 0);
        return;
    }
    
    // Calcula o subtotal
    let subtotal = 0;
    
    // Adiciona cada item ao carrinho
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Adiciona event listeners para os botões de quantidade e remoção
    const decreaseBtns = cartItemsContainer.querySelectorAll('.decrease-btn');
    const increaseBtns = cartItemsContainer.querySelectorAll('.increase-btn');
    const removeBtns = cartItemsContainer.querySelectorAll('.cart-item-remove');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.getAttribute('data-id');
            updateCartItemQuantity(itemId, -1);
            loadCartItems();
        });
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.getAttribute('data-id');
            updateCartItemQuantity(itemId, 1);
            loadCartItems();
        });
    });
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.getAttribute('data-id');
            removeFromCart(itemId);
            loadCartItems();
        });
    });
    
    // Verifica se há cupom aplicado e atualiza os totais
    const appliedCoupon = getAppliedCoupon();
    let discount = 0;
    
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
        document.getElementById('coupon-input').value = appliedCoupon.code;
    }
    
    updateCartTotals(subtotal, discount);
}

/**
 * Atualiza os totais do carrinho
 * @param {number} subtotal - Subtotal do carrinho
 * @param {number} discount - Valor do desconto
 */
function updateCartTotals(subtotal, discount) {
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscount = document.getElementById('cart-discount');
    const cartTotal = document.getElementById('cart-total');
    const discountContainer = document.getElementById('discount-container');
    
    cartSubtotal.textContent = formatCurrency(subtotal);
    
    if (discount > 0) {
        cartDiscount.textContent = `- ${formatCurrency(discount)}`;
        discountContainer.style.display = 'flex';
    } else {
        discountContainer.style.display = 'none';
    }
    
    const total = subtotal - discount;
    cartTotal.textContent = formatCurrency(total);
}

/**
 * Manipula a aplicação de cupom
 */
function handleApplyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponCode = couponInput.value.trim();
    
    if (!couponCode) {
        showToast('Atenção', 'Digite um código de cupom válido.', 'error');
        return;
    }
    
    // Remove qualquer cupom existente
    removeFromLocalStorage('appliedCoupon');
    
    // Tenta aplicar o cupom
    const result = applyCoupon(couponCode);
    
    if (result.success) {
        // Aplica o cupom imediatamente
        showToast('Cupom aplicado', `Desconto de ${result.coupon.discount}% aplicado com sucesso!`);
        
        // Destaca o campo do cupom com uma animação de sucesso
        couponInput.classList.add('coupon-success');
        setTimeout(() => {
            couponInput.classList.remove('coupon-success');
        }, 1500);
        
        // Atualiza a exibição dos itens e totais
        loadCartItems();
    } else {
        showToast('Erro', result.message, 'error');
        
        // Destaca o campo com uma animação de erro
        couponInput.classList.add('coupon-error');
        setTimeout(() => {
            couponInput.classList.remove('coupon-error');
        }, 1500);
        
        // Limpa o campo se o cupom for inválido
        couponInput.value = '';
    }
}

/**
 * Remove o cupom aplicado ao carrinho
 */
function removeCouponFromCart() {
    removeFromLocalStorage('appliedCoupon');
    document.getElementById('coupon-input').value = '';
    loadCartItems(); // Atualiza os totais
    showToast('Cupom removido', 'O cupom foi removido do carrinho.');
}

/**
 * Manipula a finalização da compra
 */
function handleCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showToast('Atenção', 'Seu carrinho está vazio.', 'error');
        return;
    }
    
    // Calcula subtotal, desconto e total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const appliedCoupon = getAppliedCoupon();
    let discount = 0;
    
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
    }
    
    const total = subtotal - discount;
    
    // Envia pedido para o WhatsApp
    sendToWhatsApp(cart, subtotal, discount, total, appliedCoupon);
    
    // Limpa o carrinho após o envio
    clearCart();
    closeCart();
    
    showToast('Pedido enviado', 'Seu pedido foi enviado com sucesso para o WhatsApp!');
}









/*main*/
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






/*store*/
/**
 * Inicializa a loja
 */
function initializeStore() {
    // Verifica se já existem produtos no localStorage, caso contrário, cria produtos padrão
    if (!loadFromLocalStorage('products')) {
        const defaultProducts = [
            {
                id: generateId(),
                name: 'Camiseta Básica',
                price: 39.90,
                category: 'camisetas',
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Camiseta básica de algodão com acabamento de primeira linha.',
                sizes: ['P', 'M', 'G', 'GG'],
                availableSizes: ['P', 'M', 'G', 'GG']
            },
            {
                id: generateId(),
                name: 'Calça Jeans',
                price: 89.90,
                category: 'calcas',
                imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Calça jeans confortável com design moderno e durável.',
                sizes: ['38', '40', '42', '44', '46'],
                availableSizes: ['38', '40', '42', '44']
            },
            {
                id: generateId(),
                name: 'Boné Esportivo',
                price: 29.90,
                category: 'acessorios',
                imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Boné esportivo com proteção UV e material respirável.',
                sizes: ['Único'],
                availableSizes: ['Único']
            },
            {
                id: generateId(),
                name: 'Camiseta Estampada',
                price: 49.90,
                category: 'camisetas',
                imageUrl: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Camiseta com estampa exclusiva, 100% algodão.',
                sizes: ['P', 'M', 'G', 'GG'],
                availableSizes: ['P', 'M', 'GG']
            },
            {
                id: generateId(),
                name: 'Calça Moletom',
                price: 79.90,
                category: 'calcas',
                imageUrl: 'https://images.unsplash.com/photo-1606486306004-5bc76f9109e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Calça de moletom confortável, ideal para o dia a dia.',
                sizes: ['P', 'M', 'G', 'GG'],
                availableSizes: ['P', 'G', 'GG']
            },
            {
                id: generateId(),
                name: 'Pulseira de Couro',
                price: 19.90,
                category: 'acessorios',
                imageUrl: 'https://images.unsplash.com/photo-1573053009858-c1ed191d8a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                description: 'Pulseira de couro artesanal com acabamento premium.',
                sizes: ['Único'],
                availableSizes: ['Único']
            }
        ];
        saveToLocalStorage('products', defaultProducts);
    }

    // Verifica se já existem configurações no localStorage, caso contrário, cria configurações padrão
    if (!loadFromLocalStorage('settings')) {
        const defaultSettings = {
            whatsappNumber: '5511999999999',
            welcomeMessage: 'Olá! Gostaria de fazer um pedido:',
            adminPassword: 'draxx' // Senha padrão para acesso administrativo
        };
        saveToLocalStorage('settings', defaultSettings);
    }

    // Inicializa o carrinho se não existir
    if (!loadFromLocalStorage('cart')) {
        saveToLocalStorage('cart', []);
    }

    // Inicializa os cupons se não existirem
    if (!loadFromLocalStorage('coupons')) {
        saveToLocalStorage('coupons', []);
    }

    // Inicializa o histórico se não existir
    if (!loadFromLocalStorage('history')) {
        saveToLocalStorage('history', []);
    }
    
    // Verifica e limpa o histórico antigo (após 24h)
    cleanOldHistory();
    
    // Inicializa novidades se não existirem
    if (!loadFromLocalStorage('news')) {
        saveToLocalStorage('news', []);
    }
}

/**
 * Funções de gerenciamento de produtos
 */
function getProducts() {
    return loadFromLocalStorage('products') || [];
}

function addProduct(productData) {
    const products = getProducts();
    const newProduct = {
        ...productData,
        id: generateId()
    };
    products.push(newProduct);
    saveToLocalStorage('products', products);

    // Registra no histórico
    addToHistory('added', productData.name, 'Produto adicionado');
    
    return newProduct;
}

function updateProduct(product) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
        products[index] = product;
        saveToLocalStorage('products', products);
        
        // Registra no histórico
        addToHistory('modified', product.name, 'Produto atualizado');
        return true;
    }
    
    return false;
}

function removeProduct(productId) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        const removedProduct = products[index];
        products.splice(index, 1);
        saveToLocalStorage('products', products);
        
        // Registra no histórico
        addToHistory('removed', removedProduct.name, 'Produto removido');
        return true;
    }
    
    return false;
}

/**
 * Funções de gerenciamento do carrinho
 */
function getCart() {
    return loadFromLocalStorage('cart') || [];
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveToLocalStorage('cart', cart);
    dispatchCustomEvent('cartUpdated');
    
    return cart;
}

function updateCartItemQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            return removeFromCart(itemId);
        }
        
        saveToLocalStorage('cart', cart);
        dispatchCustomEvent('cartUpdated');
    }
    
    return cart;
}

function removeFromCart(itemId) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
        cart.splice(index, 1);
        saveToLocalStorage('cart', cart);
        dispatchCustomEvent('cartUpdated');
    }
    
    return cart;
}

function clearCart() {
    saveToLocalStorage('cart', []);
    dispatchCustomEvent('cartUpdated');
}

/**
 * Funções de gerenciamento de cupons
 */
function getCoupons() {
    return loadFromLocalStorage('coupons') || [];
}

function addCoupon(couponData) {
    const coupons = getCoupons();
    
    // Verifica se já existe um cupom com o mesmo código
    const existingCoupon = coupons.find(c => c.code === couponData.code);
    if (existingCoupon) {
        return { success: false, message: 'Já existe um cupom com este código' };
    }
    
    // Adiciona contador de uso ao cupom
    const newCoupon = {
        ...couponData,
        usageCount: 0
    };
    
    coupons.push(newCoupon);
    saveToLocalStorage('coupons', coupons);
    
    // Registra no histórico
    addToHistory('added', `Cupom ${couponData.code}`, `Cupom de ${couponData.discount}% criado`);
    
    return { success: true, coupon: newCoupon };
}

function removeCoupon(couponCode) {
    const coupons = getCoupons();
    const index = coupons.findIndex(c => c.code === couponCode);
    
    if (index !== -1) {
        const removedCoupon = coupons[index];
        coupons.splice(index, 1);
        saveToLocalStorage('coupons', coupons);
        
        // Registra no histórico
        addToHistory('removed', `Cupom ${couponCode}`, 'Cupom removido');
        return true;
    }
    
    return false;
}

function applyCoupon(couponCode) {
    const coupons = getCoupons();
    // Faz uma busca case-insensitive para o código do cupom
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    
    if (!coupon) {
        return { success: false, message: 'Cupom não encontrado' };
    }
    
    // Verifica se o cupom expirou
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    
    if (now > expiryDate) {
        return { success: false, message: 'Este cupom expirou' };
    }
    
    // Verifica se o cupom atingiu o limite de uso
    if (coupon.usageCount >= coupon.usageLimit) {
        return { success: false, message: 'Este cupom atingiu o limite de uso' };
    }
    
    // Aplica o cupom
    saveToLocalStorage('appliedCoupon', coupon);
    
    // Incrementa o contador de uso
    const updatedCoupons = coupons.map(c => {
        if (c.code === coupon.code) {
            return { ...c, usageCount: c.usageCount + 1 };
        }
        return c;
    });
    
    saveToLocalStorage('coupons', updatedCoupons);
    
    // Retorna sucesso com o cupom aplicado
    return { success: true, message: 'Cupom aplicado com sucesso', coupon };
    
    // Atualiza o contador de uso do cupom
    coupon.usageCount += 1;
    saveToLocalStorage('coupons', coupons);
    
    addToHistory('applied', `Cupom ${coupon.code}`, `Cupom de ${coupon.discount}% aplicado no carrinho`);
    
    return { success: true, coupon };
}

function getAppliedCoupon() {
    return loadFromLocalStorage('appliedCoupon');
}

/**
 * Funções de gerenciamento de configurações
 */
function getSettings() {
    return loadFromLocalStorage('settings') || {
        whatsappNumber: '5511999999999',
        welcomeMessage: 'Olá! Gostaria de fazer um pedido:',
        adminPassword: 'draxx'
    };
}

function updateSettings(settings) {
    saveToLocalStorage('settings', settings);
    
    // Registra no histórico
    addToHistory('modified', 'Configurações', 'Configurações da loja atualizadas');
    
    return settings;
}

function verifyAdminPassword(password) {
    const settings = getSettings();
    return password === settings.adminPassword;
}

/**
 * Funções de gerenciamento de novidades
 */
function getNews() {
    return loadFromLocalStorage('news') || [];
}

function addNews(newsData) {
    const news = getNews();
    const newItem = {
        ...newsData,
        id: generateId()
    };
    news.push(newItem);
    saveToLocalStorage('news', news);
    
    // Registra no histórico
    addToHistory('added', `Novidade: ${newsData.title}`, 'Novidade adicionada');
    
    return newItem;
}

function updateNews(newsItem) {
    const news = getNews();
    const index = news.findIndex(n => n.id === newsItem.id);
    
    if (index !== -1) {
        news[index] = newsItem;
        saveToLocalStorage('news', news);
        
        // Registra no histórico
        addToHistory('modified', `Novidade: ${newsItem.title}`, 'Novidade atualizada');
        return true;
    }
    
    return false;
}

function removeNews(newsId) {
    const news = getNews();
    const index = news.findIndex(n => n.id === newsId);
    
    if (index !== -1) {
        const removedNews = news[index];
        news.splice(index, 1);
        saveToLocalStorage('news', news);
        
        // Registra no histórico
        addToHistory('removed', `Novidade: ${removedNews.title}`, 'Novidade removida');
        return true;
    }
    
    return false;
}

/**
 * Funções de gerenciamento de histórico
 */
function getHistory() {
    return loadFromLocalStorage('history') || [];
}

function addToHistory(action, itemName, details) {
    const history = getHistory();
    const historyItem = {
        timestamp: new Date().toISOString(),
        action,
        itemName,
        details
    };
    
    history.unshift(historyItem); // Adiciona ao início da lista
    
    // Limita o histórico a 100 itens para não sobrecarregar o localStorage
    if (history.length > 100) {
        history.pop();
    }
    
    saveToLocalStorage('history', history);
    
    return historyItem;
}

/**
 * Limpa o histórico de itens com mais de 24 horas
 */
function cleanOldHistory() {
    const history = getHistory();
    if (!history.length) return;
    
    const oneDayMs = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
    const now = new Date();
    
    // Filtra apenas itens com menos de 24 horas
    const filteredHistory = history.filter(item => {
        const itemDate = new Date(item.timestamp);
        const elapsed = now - itemDate;
        return elapsed < oneDayMs;
    });
    
    // Se houver alterações, salva
    if (filteredHistory.length !== history.length) {
        saveToLocalStorage('history', filteredHistory);
        console.log(`Histórico limpo: ${history.length - filteredHistory.length} itens removidos`);
    }
}

/**
 * Limpa todo o histórico manualmente
 */
function clearHistory() {
    saveToLocalStorage('history', []);
    return [];
}





/*ui*/
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





/*utlis*/
/**
 * Gera um ID único
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Formata um valor monetário para o formato brasileiro
 * @param {number} value - Valor a ser formatado
 */
function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Formata uma data ISO para o formato brasileiro
 * @param {string} dateString - Data no formato ISO
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

/**
 * Exibe uma notificação toast na tela
 * @param {string} title - Título da notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error)
 */
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon i');
    
    // Define o título e mensagem
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Define o ícone e cor baseado no tipo
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toastIcon.style.color = 'var(--success-color)';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toastIcon.style.color = 'var(--danger-color)';
    }
    
    // Exibe o toast
    toast.style.display = 'flex';
    
    // Esconde o toast após 3 segundos
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * Salva dados no localStorage
 * @param {string} key - Chave para armazenamento
 * @param {any} data - Dados a serem armazenados
 */
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Carrega dados do localStorage
 * @param {string} key - Chave para recuperação
 */
function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Remove dados do localStorage
 * @param {string} key - Chave para remoção
 */
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Dispara um evento personalizado
 * @param {string} eventName - Nome do evento
 */
function dispatchCustomEvent(eventName) {
    const event = new Event(eventName);
    document.dispatchEvent(event);
}

/**
 * Formata data e hora ISO para o formato brasileiro
 * @param {string} isoString - Data no formato ISO
 */
function formatDateTime(isoString) {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

/**
 * Envia pedido para o WhatsApp
 * @param {Array} cartItems - Itens do carrinho
 * @param {number} subtotal - Subtotal da compra
 * @param {number} discount - Valor do desconto
 * @param {number} total - Total da compra
 * @param {Object} appliedCoupon - Cupom aplicado
 */
function sendToWhatsApp(cartItems, subtotal, discount, total, appliedCoupon) {
    // Carrega as configurações da loja
    const settings = loadFromLocalStorage('settings') || { whatsappNumber: '5511999999999', welcomeMessage: 'Olá! Gostaria de fazer um pedido:' };
    
    // Monta a mensagem
    let message = settings.welcomeMessage + '\n\n';
    message += '*ITENS DO PEDIDO:*\n';
    
    cartItems.forEach(item => {
        message += `• ${item.name} (${item.quantity}x) - ${formatCurrency(item.price * item.quantity)}\n`;
    });
    
    message += '\n*RESUMO:*\n';
    message += `Subtotal: ${formatCurrency(subtotal)}\n`;
    
    if (discount > 0) {
        message += `Desconto: ${formatCurrency(discount)}`;
        if (appliedCoupon) {
            message += ` (Cupom: ${appliedCoupon.code})\n`;
        } else {
            message += '\n';
        }
    }
    
    message += `*Total: ${formatCurrency(total)}*`;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Cria o link do WhatsApp
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;
    
    // Abre o link em uma nova aba
    window.open(whatsappUrl, '_blank');
}