import React, { useState } from 'react';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import CustomTable from './CustomTable';

function TabPanel({ data = { invoices: [], products: [], customers: [] }, isLoading }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Aggregate invoice data by customer and fileName
  const aggregatedInvoices = data?.invoices?.reduce((acc, invoice) => {
    // Create a unique key using both customerName and fileName
    const key = `${invoice.customerName}-${invoice.fileName}`;
    
    if (!acc[key]) {
      acc[key] = {
        id: invoice.id,
        serialNumber: invoice.serialNumber,
        customerName: invoice.customerName,
        fileName: invoice.fileName,  // Keep track of fileName
        totalQuantity: 0,
        totalProducts: new Set(),
        tax: 0,
        totalAmount: 0,
        date: invoice.date
      };
    }

    acc[key].totalQuantity += Number(invoice.quantity || 0);
    acc[key].totalProducts.add(invoice.productName);
    acc[key].tax += Number(invoice.tax || 0);
    acc[key].totalAmount += Number(invoice.totalAmount || 0);
    
    // Keep the most recent date
    const newDate = new Date(invoice.date);
    const currentDate = new Date(acc[key].date);
    if (newDate > currentDate) {
      acc[key].date = invoice.date;
    }

    return acc;
  }, {});

  // Convert Set to number for total products count
  const finalInvoices = Object.values(aggregatedInvoices || {}).map(invoice => ({
    ...invoice,
    totalProducts: invoice.totalProducts.size
  }));

  // Aggregate customer data by fileName
  const aggregatedCustomers = data?.customers?.reduce((acc, customer) => {
    const fileName = customer.fileName;
    
    if (!acc[fileName]) {
      acc[fileName] = {
        id: `aggregated-${fileName}`,
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber,
        totalPurchaseAmount: customer.totalPurchaseAmount,
        fileName: fileName
      };
    } else {
      acc[fileName].totalPurchaseAmount += customer.totalPurchaseAmount;
    }
    
    return acc;
  }, {});

  const finalCustomers = Object.values(aggregatedCustomers || {});

  const tabs = [
    {
      label: 'Invoices',
      columns: [
        { key: 'fileName', label: 'File Name' },
        { key: 'serialNumber', label: 'Serial Number' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'totalQuantity', label: 'Total Quantity' },
        { key: 'totalProducts', label: 'Total Products' },
        { key: 'tax', label: 'Tax' },
        { key: 'totalAmount', label: 'Total Amount' },
        { key: 'date', label: 'Date' }
      ],
      data: finalInvoices
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
      data: finalCustomers
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