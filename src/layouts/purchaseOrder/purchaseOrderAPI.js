import AxiosManager from '../../axiosManager';

// Get all invoices
export const getPurchaseOrders = async () => {
  try {
    const response = await AxiosManager.get('/api/v1/purchase_orders/dashboard');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch purchase orders');
  }
};

// Create an invoice
export const createPurchaseOrder = async (purchaseOrderData) => {
  try {
    const response = await AxiosManager.post('/api/v1/purchase_orders', purchaseOrderData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create purchase order');
  }
};

// Read an invoice
export const getPurchaseOrder = async (purchaseOrderId) => {
  try {
    const response = await AxiosManager.get(`/api/v1/purchase_orders/${purchaseOrderId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get purchase order');
  }
};

// Update an invoice
export const updatePurchaseOrder = async (purchaseOrderId, purchaseOrderData) => {
  try {
    const response = await AxiosManager.put(`/api/v1/purchase_orders/${purchaseOrderId}`, purchaseOrderData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update purchase order');
  }
};

// Delete an invoice
export const deletePurchaseOrder = async (purchaseOrderId) => {
  try {
    const response = await AxiosManager.delete(`/api/v1/purchase_orders/${purchaseOrderId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete purchase order');
  }
};
