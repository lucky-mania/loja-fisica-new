// Database Service for handling all database operations

// Products Collection
const productsCollection = db.collection('products');

// Add a new product
async function addProduct(productData) {
    try {
        const docRef = await productsCollection.add({
            ...productData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        throw error;
    }
}

// Get all products
function getProducts(callback) {
    return productsCollection.onSnapshot((snapshot) => {
        const products = [];
        snapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        callback(products);
    });
}

// Update a product
async function updateProduct(productId, productData) {
    try {
        await productsCollection.doc(productId).update({
            ...productData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
    }
}

// Delete a product
async function deleteProduct(productId) {
    try {
        await productsCollection.doc(productId).delete();
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        throw error;
    }
}