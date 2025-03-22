// Função para carregar produtos em tempo real
function carregarProdutos() {
    db.collection('produtos')
        .orderBy('dataCriacao', 'desc')
        .onSnapshot((snapshot) => {
            const productsGrid = document.getElementById('products-grid');
            productsGrid.innerHTML = '';

            snapshot.forEach((doc) => {
                const produto = doc.data();
                const produtoHtml = `
                    <div class="product-card">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <h3>${produto.nome}</h3>
                        <p>R$ ${produto.preco.toFixed(2)}</p>
                        <p>${produto.descricao}</p>
                        <button onclick="adicionarAoCarrinho('${doc.id}')">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                `;
                productsGrid.innerHTML += produtoHtml;
            });
        }, (error) => {
            console.error("Erro ao carregar produtos: ", error);
        });
}

// Carregar produtos quando a página carregar
document.addEventListener('DOMContentLoaded', carregarProdutos);