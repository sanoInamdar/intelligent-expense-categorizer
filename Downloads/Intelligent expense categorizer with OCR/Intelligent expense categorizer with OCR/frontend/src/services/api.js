import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const categorizeExpense = async (text) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/categorize`, { text });
        return response.data;
    } catch (error) {
        console.error("Error categorizing expense:", error);
        throw error;
    }
};
