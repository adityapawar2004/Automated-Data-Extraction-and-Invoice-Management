import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  products: [],
  invoices: [],
  isLoading: false
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addData: (state, action) => {
      const { customers = [], products = [], invoices = [] } = action.payload;
      state.customers = [...state.customers, ...customers];
      state.products = [...state.products, ...products];
      state.invoices = [...state.invoices, ...invoices];
    },
    updateTableData: (state, action) => {
      const { tableKey, editedRow } = action.payload;

      if (tableKey === 'invoices') {
        // First, update the invoice itself
        state.invoices = state.invoices.map(invoice =>
          invoice.id === editedRow.id ? editedRow : invoice
        );

        // If customer name changed, update all related records
        const oldInvoice = state.invoices.find(inv => inv.id === editedRow.id);
        if (oldInvoice && oldInvoice.customerName !== editedRow.customerName) {
          // Update all invoices with the same old customer name
          state.invoices = state.invoices.map(invoice => {
            if (invoice.customerName === oldInvoice.customerName) {
              return {
                ...invoice,
                customerName: editedRow.customerName
              };
            }
            return invoice;
          });

          // Update customer records
          state.customers = state.customers.map(customer => {
            if (customer.customerName === oldInvoice.customerName) {
              return {
                ...customer,
                customerName: editedRow.customerName,
                totalPurchaseAmount: state.invoices
                  .filter(inv => inv.customerName === editedRow.customerName)
                  .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0)
              };
            }
            return customer;
          });
        }

        // If product name changed, update all related records
        if (oldInvoice && oldInvoice.productName !== editedRow.productName) {
          // Update all invoices with the same old product name
          state.invoices = state.invoices.map(invoice => {
            if (invoice.productName === oldInvoice.productName) {
              return {
                ...invoice,
                productName: editedRow.productName
              };
            }
            return invoice;
          });

          // Update product records
          state.products = state.products.map(product => {
            if (product.name === oldInvoice.productName) {
              return {
                ...product,
                name: editedRow.productName,
                quantity: state.invoices
                  .filter(inv => inv.productName === editedRow.productName)
                  .reduce((sum, inv) => sum + Number(inv.quantity || 0), 0)
              };
            }
            return product;
          });
        }

        // Update totals
        const updatedCustomerName = editedRow.customerName;
        if (updatedCustomerName) {
          state.customers = state.customers.map(customer => {
            if (customer.customerName === updatedCustomerName) {
              return {
                ...customer,
                totalPurchaseAmount: state.invoices
                  .filter(inv => inv.customerName === updatedCustomerName)
                  .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0)
              };
            }
            return customer;
          });
        }
      }
    },
    clearAllData: (state) => {
      state.customers = [];
      state.products = [];
      state.invoices = [];
      state.isLoading = false;
    }
  }
});

export const { setLoading, addData, updateTableData, clearAllData } = tableSlice.actions;
export default tableSlice.reducer; 