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
        console.error("Error adding product: ", error);
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
        console.error("Error updating product: ", error);
        throw error;
    }
}

// Delete a product
async function deleteProduct(productId) {
    try {
        await productsCollection.doc(productId).delete();
    } catch (error) {
        console.error("Error deleting product: ", error);
        throw error;
    }
}

// Inventory Collection
const inventoryCollection = db.collection('inventory');

// Update inventory
async function updateInventory(productId, quantity, type) {
    try {
        const inventoryRef = inventoryCollection.doc(productId);
        await db.runTransaction(async (transaction) => {
            const inventoryDoc = await transaction.get(inventoryRef);
            if (!inventoryDoc.exists) {
                transaction.set(inventoryRef, {
                    productId,
                    quantity,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                const currentQuantity = inventoryDoc.data().quantity;
                const newQuantity = type === 'add' ? currentQuantity + quantity : currentQuantity - quantity;
                transaction.update(inventoryRef, {
                    quantity: newQuantity,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
    } catch (error) {
        console.error("Error updating inventory: ", error);
        throw error;
    }
}

// Get inventory for a product
function getInventory(productId, callback) {
    return inventoryCollection.doc(productId).onSnapshot((doc) => {
        if (doc.exists) {
            callback({ id: doc.id, ...doc.data() });
        } else {
            callback(null);
        }
    });
}

// Sales Collection
const salesCollection = db.collection('sales');

// Record a new sale
async function recordSale(saleData) {
    try {
        const saleRef = await salesCollection.add({
            ...saleData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update inventory after sale
        await updateInventory(saleData.productId, saleData.quantity, 'subtract');
        
        return saleRef.id;
    } catch (error) {
        console.error("Error recording sale: ", error);
        throw error;
    }
}

// Get sales history
function getSalesHistory(callback) {
    return salesCollection
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            const sales = [];
            snapshot.forEach((doc) => {
                sales.push({ id: doc.id, ...doc.data() });
            });
            callback(sales);
        });
}

// Export all functions
export {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    updateInventory,
    getInventory,
    recordSale,
    getSalesHistory
}; 