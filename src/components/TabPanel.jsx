import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CustomTable from './CustomTable';

function TabPanel({ data = { invoices: [], products: [], customers: [] } }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: 'Invoices',
      columns: [
        { key: 'fileName', label: 'File Source' },
        { key: 'serialNumber', label: 'Serial Number' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'productName', label: 'Product Name' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'tax', label: 'Tax' },
        { key: 'totalAmount', label: 'Total Amount' },
        { key: 'date', label: 'Date' }
      ],
      data: data?.invoices || []
    },
    {
      label: 'Products',
      columns: [
        { key: 'fileName', label: 'File Source' },
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
        { key: 'fileName', label: 'File Source' },
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