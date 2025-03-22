// Função para mostrar produtos em tempo real
function mostrarProdutos() {
    const produtosGrid = document.getElementById('products-grid');
    
    // Listener em tempo real do Firestore
    db.collection('produtos')
        .orderBy('dataCriacao', 'desc')
        .onSnapshot((snapshot) => {
            produtosGrid.innerHTML = ''; // Limpa a grade de produtos
            
            snapshot.forEach((doc) => {
                const produto = doc.data();
                const produtoHtml = `
                    <div class="product-card">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <h3>${produto.nome}</h3>
                        <p class="price">R$ ${produto.preco.toFixed(2)}</p>
                        <p class="description">${produto.descricao}</p>
                        <button onclick="adicionarAoCarrinho('${doc.id}')">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                `;
                produtosGrid.innerHTML += produtoHtml;
            });
        }, (error) => {
            console.error("Erro ao carregar produtos:", error);
        });
}

// Função para filtrar produtos por categoria
function filtrarProdutos(categoria) {
    const produtosGrid = document.getElementById('products-grid');
    let query = db.collection('produtos');
    
    if (categoria !== 'all') {
        query = query.where('categoria', '==', categoria);
    }
    
    query.orderBy('dataCriacao', 'desc')
        .onSnapshot((snapshot) => {
            produtosGrid.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const produto = doc.data();
                const produtoHtml = `
                    <div class="product-card">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <h3>${produto.nome}</h3>
                        <p class="price">R$ ${produto.preco.toFixed(2)}</p>
                        <p class="description">${produto.descricao}</p>
                        <button onclick="adicionarAoCarrinho('${doc.id}')">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                `;
                produtosGrid.innerHTML += produtoHtml;
            });
        });
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(produtoId) {
    db.collection('produtos').doc(produtoId).get()
        .then((doc) => {
            if (doc.exists) {
                const produto = doc.data();
                // Aqui você pode implementar a lógica do carrinho
                alert(`Produto ${produto.nome} adicionado ao carrinho!`);
            }
        })
        .catch((error) => {
            console.error("Erro ao adicionar ao carrinho:", error);
        });
}

// Configurar filtros quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar todos os produtos inicialmente
    mostrarProdutos();
    
    // Configurar botões de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona classe active ao botão clicado
            button.classList.add('active');
            
            const categoria = button.getAttribute('data-category');
            filtrarProdutos(categoria);
        });
    });
});