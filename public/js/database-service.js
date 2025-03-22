import { db } from './firebase-config.js';
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    serverTimestamp,
    runTransaction,
    orderBy,
    query 
} from 'firebase/firestore';

// Products Collection
const productsCollection = collection(db, 'products');
const inventoryCollection = collection(db, 'inventory');
const salesCollection = collection(db, 'sales');

// Função para ouvir mudanças em tempo real
export function listenToProducts(callback) {
    return onSnapshot(productsCollection, (snapshot) => {
        const products = [];
        snapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        callback(products);
    });
}

// Adicionar produto
export async function addProduct(productData) {
    try {
        const docRef = await addDoc(productsCollection, {
            ...productData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        throw error;
    }
}

// Atualizar produto
export async function updateProduct(productId, productData) {
    try {
        const productRef = doc(productsCollection, productId);
        await updateDoc(productRef, {
            ...productData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
    }
}

// Deletar produto
export async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(productsCollection, productId));
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        throw error;
    }
}

// Atualizar inventário
export async function updateInventory(productId, quantity, type) {
    try {
        const inventoryRef = doc(inventoryCollection, productId);
        await runTransaction(db, async (transaction) => {
            const inventoryDoc = await transaction.get(inventoryRef);
            if (!inventoryDoc.exists()) {
                transaction.set(inventoryRef, {
                    productId,
                    quantity,
                    lastUpdated: serverTimestamp()
                });
            } else {
                const currentQuantity = inventoryDoc.data().quantity;
                const newQuantity = type === 'add' ? currentQuantity + quantity : currentQuantity - quantity;
                transaction.update(inventoryRef, {
                    quantity: newQuantity,
                    lastUpdated: serverTimestamp()
                });
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar inventário:", error);
        throw error;
    }
}

// Obter inventário de um produto
export function getInventory(productId, callback) {
    const inventoryRef = doc(inventoryCollection, productId);
    return onSnapshot(inventoryRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        } else {
            callback(null);
        }
    });
}

// Registrar uma venda
export async function recordSale(saleData) {
    try {
        const saleRef = await addDoc(salesCollection, {
            ...saleData,
            timestamp: serverTimestamp()
        });
        
        // Atualiza o inventário após a venda
        await updateInventory(saleData.productId, saleData.quantity, 'subtract');
        
        return saleRef.id;
    } catch (error) {
        console.error("Erro ao registrar venda:", error);
        throw error;
    }
}

// Obter histórico de vendas
export function getSalesHistory(callback) {
    const q = query(salesCollection, orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const sales = [];
        snapshot.forEach((doc) => {
            sales.push({ id: doc.id, ...doc.data() });
        });
        callback(sales);
    });
}