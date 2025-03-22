import { fetchData, postData, updateData, deleteData } from '../dados/api.js';

// Carregar Produtos no Front-End
async function loadProducts() {
    const products = await fetchData('produtos');
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.imagem}" alt="${product.nome}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.nome}</h3>
                <p class="product-price">R$ ${product.preco.toFixed(2)}</p>
                <p class="product-category">${product.categoria}</p>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Carregar Cupons
async function loadCoupons() {
    const coupons = await fetchData('cupons');
    const couponsList = document.getElementById('coupons-list');
    couponsList.innerHTML = '';
    
    coupons.forEach(coupon => {
        const li = document.createElement('li');
        li.textContent = `${coupon.codigo} - ${coupon.desconto}% OFF (Expira: ${coupon.data_expiracao})`;
        couponsList.appendChild(li);
    });
}

// Carregar Novidades
async function loadNews() {
    const news = await fetchData('novidades');
    const newsContainer = document.getElementById('news-carousel');
    newsContainer.innerHTML = '';
    
    news.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <h3>${item.titulo}</h3>
            <p>${item.descricao}</p>
            <img src="${item.imagem}" alt="${item.titulo}">
            <small>${item.data_publicacao}</small>
        `;
        newsContainer.appendChild(div);
    });
}

// Iniciar carregamento ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCoupons();
    loadNews();
});
