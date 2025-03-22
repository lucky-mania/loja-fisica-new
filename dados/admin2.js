// Função para adicionar produto
function adicionarProduto(event) {
    event.preventDefault();
    
    const produto = {
        nome: document.getElementById('product-name').value,
        preco: parseFloat(document.getElementById('product-price').value),
        categoria: document.getElementById('product-category').value,
        descricao: document.getElementById('product-description').value,
        imagem: document.getElementById('product-image').value,
        dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Adiciona ao Firestore
    db.collection('produtos').add(produto)
        .then(() => {
            alert('Produto adicionado com sucesso!');
            document.getElementById('product-form').reset();
            atualizarTabelaProdutos(); // Atualiza a tabela de produtos
        })
        .catch((error) => {
            console.error("Erro ao adicionar produto: ", error);
            alert('Erro ao adicionar produto');
        });
}

// Função para carregar produtos na tabela administrativa
function atualizarTabelaProdutos() {
    const tbody = document.querySelector('#products-table tbody');
    
    db.collection('produtos').orderBy('dataCriacao', 'desc').get()
        .then((snapshot) => {
            tbody.innerHTML = '';
            snapshot.forEach((doc) => {
                const produto = doc.data();
                const tr = `
                    <tr>
                        <td>${produto.nome}</td>
                        <td>R$ ${produto.preco.toFixed(2)}</td>
                        <td>${produto.categoria}</td>
                        <td>
                            <button onclick="editarProduto('${doc.id}')" class="btn btn-secondary">✏️ Editar</button>
                            <button onclick="deletarProduto('${doc.id}')" class="btn btn-danger">🗑️ Deletar</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += tr;
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar produtos: ", error);
        });
}

// Função para editar produto
function editarProduto(id) {
    db.collection('produtos').doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                const produto = doc.data();
                document.getElementById('product-id').value = id;
                document.getElementById('product-name').value = produto.nome;
                document.getElementById('product-price').value = produto.preco;
                document.getElementById('product-category').value = produto.categoria;
                document.getElementById('product-description').value = produto.descricao;
                document.getElementById('product-image').value = produto.imagem;
                
                // Mostra o botão de cancelar
                document.getElementById('cancel-product-btn').style.display = 'inline-block';
                // Muda o texto do botão de submit
                document.querySelector('#product-form button[type="submit"]').textContent = '💾 Atualizar';
            }
        })
        .catch((error) => {
            console.error("Erro ao carregar produto: ", error);
        });
}

// Função para atualizar produto
function atualizarProduto(event) {
    event.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const dados = {
        nome: document.getElementById('product-name').value,
        preco: parseFloat(document.getElementById('product-price').value),
        categoria: document.getElementById('product-category').value,
        descricao: document.getElementById('product-description').value,
        imagem: document.getElementById('product-image').value,
        dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('produtos').doc(id).update(dados)
        .then(() => {
            alert('Produto atualizado com sucesso!');
            resetForm();
            atualizarTabelaProdutos();
        })
        .catch((error) => {
            console.error("Erro ao atualizar produto: ", error);
            alert('Erro ao atualizar produto');
        });
}

// Função para deletar produto
function deletarProduto(id) {
    if(confirm('Tem certeza que deseja deletar este produto?')) {
        db.collection('produtos').doc(id).delete()
            .then(() => {
                alert('Produto deletado com sucesso!');
                atualizarTabelaProdutos();
            })
            .catch((error) => {
                console.error("Erro ao deletar produto: ", error);
                alert('Erro ao deletar produto');
            });
    }
}

// Função para resetar o formulário
function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('cancel-product-btn').style.display = 'none';
    document.querySelector('#product-form button[type="submit"]').textContent = '💾 Salvar';
}

// Adicionar listeners quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('product-form');
    if(productForm) {
        productForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const id = document.getElementById('product-id').value;
            if(id) {
                atualizarProduto(event);
            } else {
                adicionarProduto(event);
            }
        });
    }

    // Listener para o botão de cancelar
    const cancelBtn = document.getElementById('cancel-product-btn');
    if(cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }

    // Carrega os produtos iniciais
    atualizarTabelaProdutos();
});