// Função para adicionar produto
function adicionarProduto(event) {
    event.preventDefault();
    
    const produto = {
        nome: document.getElementById('product-name').value,
        preco: parseFloat(document.getElementById('product-price').value),
        categoria: document.getElementById('product-category').value,
        descricao: document.getElementById('product-description').value,
        imagem: document.getElementById('product-image').value,
        dataCriacao: new Date()
    };

    db.collection('produtos').add(produto)
        .then(() => {
            alert('Produto adicionado com sucesso!');
            document.getElementById('product-form').reset();
        })
        .catch((error) => {
            console.error("Erro ao adicionar produto: ", error);
            alert('Erro ao adicionar produto');
        });
}

// Função para atualizar produto
function atualizarProduto(id, dados) {
    db.collection('produtos').doc(id).update(dados)
        .then(() => {
            alert('Produto atualizado com sucesso!');
        })
        .catch((error) => {
            console.error("Erro ao atualizar produto: ", error);
            alert('Erro ao atualizar produto');
        });
}

// Função para deletar produto
function deletarProduto(id) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
        db.collection('produtos').doc(id).delete()
            .then(() => {
                alert('Produto deletado com sucesso!');
            })
            .catch((error) => {
                console.error("Erro ao deletar produto: ", error);
                alert('Erro ao deletar produto');
            });
    }
}

// Adicionar listeners aos formulários
document.getElementById('product-form').addEventListener('submit', adicionarProduto);