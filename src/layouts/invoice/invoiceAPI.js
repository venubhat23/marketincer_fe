import AxiosManager from '../../axiosManager';

// Get all invoices
export const getInvoices = async () => {
  try {
    const response = await AxiosManager.get('/api/v1/invoices/dashboard');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch invoices');
  }
};

// Create an invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await AxiosManager.post('/api/v1/invoices', invoiceData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create invoice');
  }
};

// Read an invoice
export const getInvoice = async (invoiceId) => {
  try {
    const response = await AxiosManager.get(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get invoice');
  }
};

// Update an invoice
export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    const response = await AxiosManager.put(`/invoices/${invoiceId}`, invoiceData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update invoice');
  }
};

// Delete an invoice
export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await AxiosManager.delete(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete invoice');
  }
};
