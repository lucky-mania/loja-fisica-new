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