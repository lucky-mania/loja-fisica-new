import { db } from './firebase-config.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Função para testar a conexão
async function testConnection() {
    try {
        // Tenta criar uma coleção de teste
        const testCollection = collection(db, 'test');
        
        // Tenta adicionar um documento
        const docRef = await addDoc(testCollection, {
            timestamp: new Date(),
            message: 'Teste de conexão'
        });
        
        console.log('✅ Conexão com Firebase estabelecida com sucesso!');
        console.log('Documento criado com ID:', docRef.id);
        
        // Tenta ler os documentos
        const querySnapshot = await getDocs(testCollection);
        console.log('Documentos na coleção:');
        querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
        });
        
        return true;
    } catch (error) {
        console.error('❌ Erro na conexão com Firebase:', error);
        return false;
    }
}

// Executa o teste
testConnection(); 