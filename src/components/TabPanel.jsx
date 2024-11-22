import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CustomTable from './CustomTable';

function TabPanel({ data = { invoices: [], products: [], customers: [] } }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Aggregate invoice data by customer
  const aggregatedInvoices = data?.invoices?.reduce((acc, invoice) => {
    const customerName = invoice.customerName;
    
    if (!acc[customerName]) {
      acc[customerName] = {
        id: invoice.id,
        serialNumber: invoice.serialNumber,
        customerName: invoice.customerName,
        totalQuantity: 0,
        totalProducts: new Set(), // Using Set to track unique products
        tax: 0,
        totalAmount: 0,
        date: invoice.date
      };
    }

    acc[customerName].totalQuantity += Number(invoice.quantity || 0);
    acc[customerName].totalProducts.add(invoice.productName); // Add product to Set
    acc[customerName].tax += Number(invoice.tax || 0);
    acc[customerName].totalAmount += Number(invoice.totalAmount || 0);
    
    // Keep the most recent date
    const newDate = new Date(invoice.date);
    const currentDate = new Date(acc[customerName].date);
    if (newDate > currentDate) {
      acc[customerName].date = invoice.date;
    }

    return acc;
  }, {});

  // Convert Set to number for total products count
  const finalInvoices = Object.values(aggregatedInvoices || {}).map(invoice => ({
    ...invoice,
    totalProducts: invoice.totalProducts.size // Convert Set to number
  }));

  const tabs = [
    {
      label: 'Invoices',
      columns: [
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
            <CustomTable columns={tab.columns} data={tab.data} />
          )}
        </div>
      ))}
    </Box>
  );
}

export default TabPanel; 