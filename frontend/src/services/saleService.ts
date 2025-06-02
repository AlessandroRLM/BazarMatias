import AxiosInstance from "../helpers/AxiosInstance"

export const fetchClientsForSelect = async (search: string) => {
    try {
        if(!search) {
            const response = await AxiosInstance.get('/api/sales/clients/?page_size=20')
            return response.data
        }

        const response = await AxiosInstance.get('/api/sales/clients/?page_size=20&search=' + search)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createQuote = async (data: any) => {
    try {
        const response = await AxiosInstance.post('/api/sales/quotes/', data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const editQuote = async (quoteId: string, data: any) => {
    try{
        const response = await AxiosInstance.put(`/api/sales/quotes/${quoteId}/`, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteQuote = async (quoteId: string) => {
    const response = await AxiosInstance.delete(`/api/sales/quotes/${quoteId}/`)
    return response.data
}

export const sendQuoteEmail = async (quoteId: string) => {
    try {
        const response = await AxiosInstance.post(`/api/sales/quotes/${quoteId}/send-email/`);
        return response.data;
    } catch (error) {
        console.error('Error sending quote email:', error);
        throw error;
    }
};