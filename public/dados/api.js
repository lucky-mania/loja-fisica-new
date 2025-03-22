const API_URL = 'http://localhost:3000'; // Atualize conforme necessário

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar ${endpoint}:`, error);
        return [];
    }
}

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(`Erro ao enviar ${endpoint}:`, error);
    }
}

async function updateData(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(`Erro ao atualizar ${endpoint}:`, error);
    }
}

async function deleteData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, { method: 'DELETE' });
        return await response.json();
    } catch (error) {
        console.error(`Erro ao deletar ${endpoint}:`, error);
    }
}

export { fetchData, postData, updateData, deleteData };
