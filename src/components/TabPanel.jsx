import React, { useState } from 'react';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import CustomTable from './CustomTable';

function TabPanel({ data = { invoices: [], products: [], customers: [] }, isLoading }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Modify the invoice processing to keep individual product rows
  const processedInvoices = data?.invoices?.map(invoice => ({
    id: `${invoice.id}-${invoice.productName}`,
    fileName: invoice.fileName,
    serialNumber: invoice.serialNumber,
    customerName: invoice.customerName,
    productName: invoice.productName,
    quantity: Number(invoice.quantity || 0),
    tax: Number(invoice.tax || 0),
    totalAmount: Number(invoice.totalAmount || 0),
    date: invoice.date
  }));

  const tabs = [
    {
      label: 'Invoices',
      columns: [
        { key: 'fileName', label: 'File Name' },
        { key: 'serialNumber', label: 'Serial Number' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'productName', label: 'Product Name' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'tax', label: 'Tax' },
        { key: 'totalAmount', label: 'Total Amount' },
        { key: 'date', label: 'Date' }
      ],
      data: processedInvoices || []
    },
    {
      label: 'Products',
      columns: [
        { key: 'fileName', label: 'File Name' },
        { key: 'name', label: 'Name' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'unitPrice', label: 'Unit Price' },
        { key: 'tax', label: 'Tax' },
        { key: 'priceWithTax', label: 'Price with Tax' },
        { key: 'discount', label: 'Discount' }
      ],
      data: data?.products || []
    },
    {
      label: 'Customers',
      columns: [
        { key: 'fileName', label: 'File Name' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'totalPurchaseAmount', label: 'Total Purchase Amount' }
      ],
      data: data?.customers || []
    }
  ];

  return (
    <Box>
      <Tabs value={value} onChange={handleChange}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          hidden={value !== index}
          style={{ padding: '20px' }}
        >
          {value === index && (
            isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <CustomTable columns={tab.columns} data={tab.data} />
            )
          )}
        </div>
      ))}
    </Box>
  );
}

export default TabPanel; 